import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnDestroy, signal, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  releaseDateValidator,
  verifyIdExist,
  yearVerification,
} from '../../shared/globals-definitions/forms-functions';
import { ProductWebServices } from '../../services/product-web-services.service';
import { finalize, of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../interfaces/products.interfaces';
import { GlobalModalService } from '../../components/global-modal-messages/services/global-modal-service.service';
import { UrlFront } from '../../shared/globals-definitions/url-const';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-product-form-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, Footer],
  templateUrl: './product-form-component.html',
  styleUrl: './product-form-component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly activatedRouter = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly globalModalService = inject(GlobalModalService);
  private readonly location = inject(Location);
  private readonly productService = inject(ProductWebServices);
  public isLoading = signal(false);
  private readonly onDestroy$ = new Subject<void>();

  urlValidator = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  private currentIdProduct =
    this.activatedRouter.snapshot.paramMap.get('idProduct');
  registrationForm: FormGroup = this.fb.group(
    {
      id: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          asyncValidators: [verifyIdExist(this.productService)],
          updateOn: 'blur',
        },
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [
        null,
        [Validators.required, Validators.pattern(this.urlValidator)],
      ],
      date_release: [null, [Validators.required, releaseDateValidator]],
      date_revision: [null, Validators.required],
    },
    { validators: [yearVerification('date_release', 'date_revision')] }
  );
  navigationState = this.location.getState() as Product;
  navigationID: string | null = null;

  ngOnInit(): void {
    this.navigationID = this.navigationState?.id ?? null;
    this.isEditProduct();
  }

  isEditProduct() {
    if (this.router.url.includes(UrlFront.EditProduct)) {
      if (
        this.navigationState?.id &&
        this.navigationState?.id === this.currentIdProduct
      ) {
        this.registrationForm.patchValue(this.navigationState);
        this.registrationForm.get('id')?.disable();
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.location.go(this.location.path(), '', {});
  }

  onReset() {
    if (!this.navigationState?.id) {
      this.registrationForm.get('id')?.reset();
    }
    this.registrationForm.get('name')?.reset();
    this.registrationForm.get('description')?.reset();
    this.registrationForm.get('logo')?.reset();
    this.registrationForm.get('date_release')?.reset();
    this.registrationForm.get('date_revision')?.reset();
  }
  onSubmit() {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.valid) {
      this.isLoading.set(true);

      this.productService
        .createProduct(
          this.registrationForm.getRawValue(),
          this.navigationState?.id ? true : false
        )
        .pipe(
          take(1),
          switchMap((resp) => {
            if (resp?.message && typeof resp.message === 'string') {
              return this.globalModalService
                .success(
                  this.navigationState?.id
                    ? 'Producto Actualizado'
                    : 'Producto Agregado'
                )
                .pipe(take(1));
            }
            return of(null);
          }),
          finalize(() => this.isLoading.set(false)),
          takeUntil(this.onDestroy$)
        )
        .subscribe((resp) =>
          this.router.navigate([`/${UrlFront.ManageProduct}`])
        );
    }
  }

  errorMessage(control: string, min?: number, max?: number) {
    const fieldControl = this.registrationForm.get(control);
    if (fieldControl?.hasError('required')) {
      return 'Este Campo es requerido.';
    }
    if (fieldControl?.hasError('minlength')) {
      return `Requiere minimo ${min}`;
    }
    if (fieldControl?.hasError('maxlength')) {
      return `Requiere máximo ${max}`;
    }
    if (fieldControl?.hasError('revisionReleaseDate')) {
      return `La fecha dee ser mayor o igual a la fecha actual`;
    }
    if (fieldControl?.hasError('pattern')) {
      return `No es un url válido`;
    }
    if (fieldControl?.hasError('existProduct')) {
      return `Id existente`;
    }
    return '';
  }

  isControlError(control: string) {
    const fieldControl = this.registrationForm.get(control);

    return (
      fieldControl?.invalid && (fieldControl?.dirty || fieldControl?.touched)
    );
  }
}
