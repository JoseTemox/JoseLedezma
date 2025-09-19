import { TestBed } from '@angular/core/testing';

import { ProductWebServices } from './product-web-services.service';

describe('ProductWebServices', () => {
  let service: ProductWebServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductWebServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
