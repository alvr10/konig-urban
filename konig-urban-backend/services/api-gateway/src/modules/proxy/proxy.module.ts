import { Module, MiddlewareConsumer, NestModule, Injectable } from '@nestjs/common';
import { ConsulService } from '@konig/shared';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

const ROUTE_TO_SERVICE: Record<string, string> = {
  '/catalog': 'catalog-service',
  '/customers': 'customers-service',
  '/finance': 'finance-service',
  '/hr': 'hr-service',
  '/marketing': 'marketing-service',
  '/orders': 'orders-service',
  '/production': 'production-service',
};

@Module({})
@Injectable()
export class ProxyModule implements NestModule {
  private readonly serviceIndices: Map<string, number> = new Map();

  constructor(private readonly consulService: ConsulService) { }

  configure(consumer: MiddlewareConsumer) {
    for (const [prefix, serviceName] of Object.entries(ROUTE_TO_SERVICE)) {
      consumer.apply(
        async (req: Request, res: Response, next: NextFunction) => {
          // Resolve target from registry at request time
          const instances = await this.consulService.resolve(serviceName);
          if (!instances || !instances.length) {
            res.status(503).json({ error: `${serviceName} unavailable` });
            return;
          }

          // Round-robin load balancing across healthy instances
          const currentIndex = this.serviceIndices.get(serviceName) || 0;
          const nextIndex = (currentIndex + 1) % instances.length;
          this.serviceIndices.set(serviceName, nextIndex);

          const instance = instances[currentIndex % instances.length];
          const target = `http://${instance.host}:${instance.port}`;

          createProxyMiddleware({
            target,
            changeOrigin: true,
            on: {
              error: (err, _req, res: Response | any) => {
                // res type cast because of library interface mismatch
                (res as Response).status(502).json({ error: 'Service unavailable', detail: err.message });
              },
            },
          })(req, res as any, next);
        }
      ).forRoutes(prefix);
    }
  }
}