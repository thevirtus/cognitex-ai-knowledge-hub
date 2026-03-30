import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(searchQuery?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products', searchQuery],
    queryFn: () => fetchProducts(50, searchQuery),
    staleTime: 1000 * 60 * 5,
  });
}

export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
}
