export interface ProductsResponse {
  data: Product[];
  message?: string | undefined;
}
export interface DeleteProductsResponse {
  message?: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;
}
