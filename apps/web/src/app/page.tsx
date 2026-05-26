import { getProducts } from '@/lib/woocommerce';
import { HomeClient } from './HomeClient';

export const revalidate = 60; // ISR cache every 60 seconds

export default async function Page() {
  const initialProducts = await getProducts({ per_page: 12 }).catch((err) => {
    console.error('Failed to fetch products from WooCommerce API:', err);
    return [];
  });

  return <HomeClient initialProducts={initialProducts} />;
}
