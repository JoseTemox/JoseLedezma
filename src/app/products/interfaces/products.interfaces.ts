export interface ProductsResponse {
  data: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;
}
