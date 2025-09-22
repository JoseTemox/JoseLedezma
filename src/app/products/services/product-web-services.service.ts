import { inject, Injectable } from '@angular/core';
import { WebRequest } from '../shared/services/web-request.service';
import {
  UrlChildProducts,
  UrlProducts,
} from '../shared/globals-definitions/url-const';
import { Observable } from 'rxjs';
import {
  DeleteProductsResponse,
  Product,
  ProductsResponse,
} from '../interfaces/products.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductWebServices {
  private readonly webRequestService = inject(WebRequest);

  getProducts(): Observable<ProductsResponse> {
    return this.webRequestService.get(`${UrlProducts.PRODUCTS}`);
  }

  productIdValidator(idProduct: string): Observable<boolean> {
    return this.webRequestService.get(
      `${UrlProducts.PRODUCTS}/${UrlChildProducts.VERIFICATION}/${idProduct}`
    );
  }

  createProduct(
    product: Product,
    isUpdate: boolean
  ): Observable<ProductsResponse> {
    return isUpdate
      ? this.webRequestService.put(
          `${UrlProducts.PRODUCTS}/${product.id}`,
          product
        )
      : this.webRequestService.post(`${UrlProducts.PRODUCTS}`, product);
  }

  deleteProduct(
    idProduct: string | number | undefined
  ): Observable<DeleteProductsResponse> {
    return this.webRequestService.delete(
      `${UrlProducts.PRODUCTS}/${idProduct}`
    );
  }
}
