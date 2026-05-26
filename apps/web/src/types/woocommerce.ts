export interface WooCommerceProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  images: WooCommerceProductImage[];
  categories: WooCommerceCategory[];
}

export interface WooCommerceFetchOptions {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
}
