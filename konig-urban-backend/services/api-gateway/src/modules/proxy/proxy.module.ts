import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConsulService } from '@konig/shared';
import { createProxyMiddleware } from 'http-proxy-middleware';

const ROUTE_TO_SERVICE: Record<string, string> = {
  '/api/v1/catalog': 'catalog-service',
  '/api/v1/customers': 'customers-service',
  '/api/v1/finance': 'finance-service',
  '/api/v1/hr': 'hr-service',
  '/api/v1/marketing': 'marketing-service',
  '/api/v1/orders': 'orders-service',
  '/api/v1/production': 'production-service',
};

@Module({})
export class ProxyModule implements NestModule {
  private readonly serviceIndices: Map<string, number> = new Map();

  constructor(private readonly consulService: ConsulService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      async (req: any, res: any, next: any) => {
        const url = req.url;
        
        // Only proxy /api/v1/ routes
        if (!url.startsWith('/api/v1/')) {
           return next();
        }

        // Find service match
        const entry = Object.entries(ROUTE_TO_SERVICE).find(([prefix]) => 
          url.startsWith(prefix)
        );

        if (!entry) {
          console.log(`[Proxy] No route match for: ${url}`);
          return next();
        }

        const [_, serviceName] = entry;

        // Resolve target
        const instances = await this.consulService.resolve(serviceName);
        if (!instances || !instances.length) {
          console.error(`[Proxy] Service ${serviceName} unavailable in Consul registry`);
          res.status(503).json({ error: `${serviceName} unavailable` });
          return;
        }

        // Load balance
        const currentIndex = this.serviceIndices.get(serviceName) || 0;
        const nextIndex = (currentIndex + 1) % instances.length;
        this.serviceIndices.set(serviceName, nextIndex);

        const instance = instances[currentIndex % instances.length];
        const target = `http://${instance.host}:${instance.port}`;

        console.log(`[Proxy] Forwarding ${url} -> ${target}`);

        createProxyMiddleware({
          target,
          changeOrigin: true,
          // Explicitly preserve the path
          pathRewrite: (path) => path, 
          on: {
            error: (err, _req, res: any) => {
              console.error(`[Proxy] Error forwarding to ${target}: ${err.message}`);
              res.status(502).json({ error: 'Service unavailable', detail: err.message });
            },
          },
        })(req, res, next);
      }
    ).forRoutes('*'); // Match absolutely everything to avoid NestJS 11 routing quirks
  }
}