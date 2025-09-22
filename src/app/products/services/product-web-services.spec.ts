import { TestBed } from '@angular/core/testing';

import { ProductWebServices } from './product-web-services.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { WebRequest } from '../shared/services/web-request.service';
import { Product } from '../interfaces/products.interfaces';
import { of } from 'rxjs';
import {
  UrlChildProducts,
  UrlProducts,
} from '../shared/globals-definitions/url-const';

describe('ProductWebServices', () => {
  let service: ProductWebServices;
  let webRequestService: jasmine.SpyObj<WebRequest>;

  const mockProduct: Product = {
    id: '1234',
    name: 'Test Product',
    description: 'A test product.',
    logo: 'logo.png',
    date_release: new Date(),
    date_revision: new Date(),
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('WebRequest', [
      'get',
      'post',
      'put',
      'delete',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductWebServices,
        { provide: WebRequest, useValue: spy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductWebServices);
    webRequestService = TestBed.inject(
      WebRequest
    ) as jasmine.SpyObj<WebRequest>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get on webRequestService with the correct endpoint for getProducts', () => {
    webRequestService.get.and.returnValue(of({ data: [mockProduct] }));

    service.getProducts().subscribe((resp) => {
      expect(resp.data).toEqual([mockProduct]);
    });

    expect(webRequestService.get).toHaveBeenCalledWith(UrlProducts.PRODUCTS);
  });

  it('should call get on webRequestService with the correct endpoint for productIdValidator', () => {
    const id = '5678';
    webRequestService.get.and.returnValue(of(true));

    service.productIdValidator(id).subscribe((isValid) => {
      expect(isValid).toBe(true);
    });

    expect(webRequestService.get).toHaveBeenCalledWith(
      `${UrlProducts.PRODUCTS}/${UrlChildProducts.VERIFICATION}/${id}`
    );
  });

  it('should call put on webRequestService when isUpdate is true', () => {
    const isUpdate = true;
    webRequestService.put.and.returnValue(of({ message: 'Updated' }));

    service.createProduct(mockProduct, isUpdate).subscribe((resp) => {
      expect(resp.message).toBe('Updated');
    });

    expect(webRequestService.put).toHaveBeenCalledWith(
      `${UrlProducts.PRODUCTS}/${mockProduct.id}`,
      mockProduct
    );
  });

  it('should call post on webRequestService when isUpdate is false', () => {
    const isUpdate = false;
    webRequestService.post.and.returnValue(of({ message: 'Created' }));

    service.createProduct(mockProduct, isUpdate).subscribe((resp) => {
      expect(resp.message).toBe('Created');
    });

    expect(webRequestService.post).toHaveBeenCalledWith(
      `${UrlProducts.PRODUCTS}`,
      mockProduct
    );
  });

  it('should call delete on webRequestService with the correct endpoint', () => {
    const id = '5678';
    webRequestService.delete.and.returnValue(of({ message: 'Deleted' }));

    service.deleteProduct(id).subscribe((resp) => {
      expect(resp.message).toBe('Deleted');
    });

    expect(webRequestService.delete).toHaveBeenCalledWith(
      `${UrlProducts.PRODUCTS}/${id}`
    );
  });
});
