import { WooCommerceProduct, WooCommerceFetchOptions } from '@/types/woocommerce';

const WOOCOMMERCE_URL =
  process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL || 'http://localhost/konigurban.com';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

export async function fetchWooCommerce<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('WooCommerce API credentials are not configured.');
  }

  // Construct plain permalink URL style since Apache mod_rewrite is inactive on local site
  const baseUrl = WOOCOMMERCE_URL.replace(/\/$/, '');
  const urlObj = new URL(`${baseUrl}/index.php`);
  urlObj.searchParams.set('rest_route', `/wc/v3/${endpoint.split('?')[0]}`);

  // Append credentials as query parameters (safest for local HTTP/CGI setups)
  urlObj.searchParams.set('consumer_key', CONSUMER_KEY);
  urlObj.searchParams.set('consumer_secret', CONSUMER_SECRET);

  // Append any existing parameters from endpoint
  if (endpoint.includes('?')) {
    const endpointParams = new URLSearchParams(endpoint.split('?')[1]);
    endpointParams.forEach((value, key) => {
      urlObj.searchParams.set(key, value);
    });
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(urlObj.toString(), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `WooCommerce API error: ${response.statusText} (${response.status}) - ${errorBody}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getProducts(
  options: WooCommerceFetchOptions = {},
): Promise<WooCommerceProduct[]> {
  const params = new URLSearchParams();
  if (options.page) params.append('page', options.page.toString());
  if (options.per_page) params.append('per_page', options.per_page.toString());
  if (options.search) params.append('search', options.search);
  if (options.category) params.append('category', options.category);

  const query = params.toString();
  const endpoint = query ? `products?${query}` : 'products';

  return fetchWooCommerce<WooCommerceProduct[]>(endpoint, {
    next: { revalidate: 60 },
  });
}
