import { inject, Injectable } from '@angular/core';
import { WebRequest } from '../shared/services/web-request.service';
import { environment } from '../../../environments/environment';
import { UrlFront, UrlProducts } from '../shared/globals-definitions/url-const';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../interfaces/products.interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductWebServices {
  private readonly webRequestService = inject(WebRequest);

  getProducts(): Observable<ProductsResponse> {
    return this.webRequestService.get(`${UrlProducts.PRODUCTS}`);
  }
}
