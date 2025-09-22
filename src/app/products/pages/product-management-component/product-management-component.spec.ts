import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ProductManagementComponent } from './product-management-component';
import { ProductWebServices } from '../../services/product-web-services.service';
import { WebRequest } from '../../shared/services/web-request.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/products.interfaces';
import { of } from 'rxjs';
import { UrlFront } from '../../shared/globals-definitions/url-const';
import { GlobalModalService } from '../../components/global-modal-messages/services/global-modal-service.service';

class MockRouter {
  url = '';
  navigate = jasmine.createSpy('navigate');
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product A',
    description: 'Desc A',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: '2',
    name: 'Product B',
    description: 'Desc B',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: '3',
    name: 'Product C',
    description: 'Desc C',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: '4',
    name: 'Product D',
    description: 'Desc D',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: '5',
    name: 'Product E',
    description: 'Desc E',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  },
  {
    id: '6',
    name: 'Product F',
    description: 'Desc F',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  },
];

const mockRouter = {
  url: '',
  navigate: jasmine.createSpy('navigate'),
};

describe('ProductManagementComponent', () => {
  let mockProductWebService: any;
  let mockGlobalModalService: any;
  let component: ProductManagementComponent;
  let fixture: ComponentFixture<ProductManagementComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    mockGlobalModalService = {
      confirm: jasmine
        .createSpy('confirm')
        .and.returnValue(of({ confirmed: true })),
      success: jasmine.createSpy('success').and.returnValue(of(true)),
    };

    mockProductWebService = {
      getProducts: jasmine
        .createSpy('getProducts')
        .and.returnValue(of({ data: mockProducts })),
      deleteProduct: jasmine
        .createSpy('deleteProduct')
        .and.returnValue(of({ message: 'Success' })),
    };
    await TestBed.configureTestingModule({
      imports: [ProductManagementComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ProductWebServices,
        WebRequest,
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: GlobalModalService, useValue: mockGlobalModalService },
        { provide: ProductWebServices, useValue: mockProductWebService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductManagementComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products by search term', () => {
    component.products.set(mockProducts);
    component['handleSearch']('product A');
    expect(component.productsFiltered()).toEqual([mockProducts[0]]);
  });

  it('should reset filtered products when search term is empty', () => {
    component.products.set(mockProducts);
    component.productsFiltered.set([mockProducts[0]]);
    component['handleSearch']('');
    expect(component.productsFiltered()).toEqual(mockProducts);
  });

  it('should not delete the product if confirmation is not received', fakeAsync(() => {
    mockGlobalModalService.confirm.and.returnValue(of({ confirmed: false }));
    spyOn(component, 'getAllProducts');

    component.onDeleteProduct(mockProducts[0]);
    tick();

    expect(mockGlobalModalService.confirm).toHaveBeenCalled();
    expect(mockProductWebService.deleteProduct).not.toHaveBeenCalled();
    expect(component.getAllProducts).not.toHaveBeenCalled();
  }));

  it('should navigate to the edit product page with state on onEditProduct', () => {
    component.onEditProduct(mockProducts[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`/${UrlFront.EditProduct}`, mockProducts[0].id],
      { state: mockProducts[0] }
    );
  });

  it('should navigate to the new product page on newProduct', () => {
    mockRouter.url = UrlFront.NewProduct;
    component.newProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      `${UrlFront.NewProduct}`,
    ]);
  });

  it('should paginate correctly on goToPage', () => {
    component.productsFiltered.set(mockProducts);
    component.pageSize = 2;
    component.calculatePagination();

    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.pageData().length).toBe(2);
    expect(component.pageData()[0].id).toBe('3');
  });

  it('should not go to an invalid page', () => {
    component.productsFiltered.set(mockProducts);
    component.pageSize = 2;
    component.calculatePagination();

    component.currentPage = 2;
    component.goToPage(5);
    expect(component.currentPage).toBe(2);
  });

  it('should reset current page to 1 if it is out of bounds', () => {
    component.productsFiltered.set(mockProducts);
    component.pageSize = 5;
    component.currentPage = 3;
    component.calculatePagination();
    expect(component.currentPage).toBe(2);
  });

  it('should not change page if the page number is out of bounds', () => {
    component.productsFiltered.set(mockProducts);
    component.pageSize = 2;
    component.calculatePagination();
    component.currentPage = 2;

    component.goToPage(0);

    expect(component.currentPage).toBe(2);

    component.goToPage(100);

    expect(component.currentPage).toBe(2);
  });
  it('should update pageSize and recalculate pagination', () => {
    spyOn(component, 'calculatePagination');
    const mockEvent = { target: { value: '10' } };

    component.pageSizeChange(mockEvent);

    expect(component.pageSize).toBe(10);
    expect(component.calculatePagination).toHaveBeenCalled();
  });
});
