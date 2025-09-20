import { inject, Injectable } from '@angular/core';
import { WebRequest } from '../shared/services/web-request.service';
import { environment } from '../../../environments/environment';
import {
  UrlChildProducts,
  UrlFront,
  UrlProducts,
} from '../shared/globals-definitions/url-const';
import { Observable } from 'rxjs';
import {
  DeleteProductsResponse,
  Product,
  ProductsResponse,
} from '../interfaces/products.interfaces';
import { HttpClient } from '@angular/common/http';

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

  createProduct(product: Product): Observable<ProductsResponse> {
    return this.webRequestService.post(`${UrlProducts.PRODUCTS}`, product);
  }

  deleteProduct(
    idProduct: string | number
  ): Observable<DeleteProductsResponse> {
    return this.webRequestService.delete(
      `${UrlProducts.PRODUCTS}/${idProduct}`
    );
  }
}
