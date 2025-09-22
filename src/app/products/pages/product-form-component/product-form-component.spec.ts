import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form-component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductWebServices } from '../../services/product-web-services.service';
import { WebRequest } from '../../shared/services/web-request.service';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalModalService } from '../../components/global-modal-messages/services/global-modal-service.service';
import { UrlFront } from '../../shared/globals-definitions/url-const';

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: (param: string) => {
        if (param === 'idProduct') {
          return '123';
        }
        return null;
      },
    },
  },
};

const mockLocation = {
  getState: () => {
    return { id: '123' };
  },
};

const mockRouter = {
  url: '',
  navigate: jasmine.createSpy('navigate'),
};

const mockGlobalModalService = {
  success: jasmine.createSpy('success').and.returnValue(of(true)),
  error: jasmine.createSpy('error').and.returnValue(of(true)),
};

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],

      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ProductWebServices,
        WebRequest,
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalModalService, useValue: mockGlobalModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Most Contain a form with id, name, logo', () => {
    expect(component.registrationForm.contains('id')).toBeTruthy();
  });

  it('should patch the form and disable the id field if in edit mode and navigation state matches', () => {
    component.registrationForm.setValue({
      id: '1234',
      name: 'Nombre de Producto',
      description: 'Descripción del producto de prueba',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    });
    mockRouter.url = UrlFront.EditProduct;
    component.navigationState = { id: '123' } as any;
    component['currentIdProduct'] = '123';

    spyOn(component.registrationForm, 'patchValue');
    spyOn(component.registrationForm.get('id')!, 'disable');

    component.isEditProduct();

    expect(component.registrationForm.patchValue).toHaveBeenCalledWith(
      component.navigationState
    );
    expect(component.registrationForm.get('id')?.disable).toHaveBeenCalled();
  });

  it('should navigate to home if in edit mode but navigation state is invalid', () => {
    mockRouter.url = UrlFront.EditProduct;
    component.navigationState = { id: 'invalid-id' } as any;
    component['currentIdProduct'] = '456';

    component.isEditProduct();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  describe('Error Message', () => {
    it('should return required error message', () => {
      component.registrationForm.get('id')?.setErrors({ required: true });
      expect(component.errorMessage('id')).toBe('Este Campo es requerido.');
    });

    it('should return minlength error message', () => {
      component.registrationForm
        .get('name')
        ?.setErrors({ minlength: { requiredLength: 5, actualLength: 2 } });
      expect(component.errorMessage('name', 5)).toBe('Requiere minimo 5');
    });

    it('should return maxlength error message', () => {
      component.registrationForm
        .get('name')
        ?.setErrors({ maxlength: { requiredLength: 100, actualLength: 150 } });
      expect(component.errorMessage('name', undefined, 100)).toBe(
        'Requiere máximo 100'
      );
    });

    it('should return custom revision date error message', () => {
      component.registrationForm
        .get('date_release')
        ?.setErrors({ revisionReleaseDate: true });
      expect(component.errorMessage('date_release')).toBe(
        'La fecha dee ser mayor o igual a la fecha actual'
      );
    });

    it('should return custom existence error message', () => {
      component.registrationForm.get('id')?.setErrors({ existProduct: true });
      expect(component.errorMessage('id')).toBe('Id existente');
    });

    it('should return empty string if no errors', () => {
      component.registrationForm.get('id')?.setErrors(null);
      expect(component.errorMessage('id')).toBe('');
    });
  });

  it('should reset all form fields on onReset', () => {
    component.navigationState = { id: '123' } as any;
    component.registrationForm.setValue({
      id: '123',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'test.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    });

    component.onReset();

    expect(component.registrationForm.get('id')?.value).toBe('123');
    expect(component.registrationForm.get('name')?.value).toBeNull();
  });

  it('should reset the id field if navigation state is not present', () => {
    component.navigationState = null as any;
    component.registrationForm.get('id')?.setValue('123');

    component.onReset();

    expect(component.registrationForm.get('id')?.value).toBeNull();
  });
});
