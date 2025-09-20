import { CommonModule } from '@angular/common';
import { AbsoluteSourceSpan } from '@angular/compiler';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  AbstractControl,
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
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-form-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product-form-component.html',
  styleUrl: './product-form-component.scss',
})
export class ProductFormComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductWebServices);
  public isLoading = signal(false);
  private readonly onDestroy$ = new Subject<void>();
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
      logo: [null, Validators.required],
      date_release: [null, [Validators.required, releaseDateValidator]],
      date_revision: [null, Validators.required],
    },
    { validators: [yearVerification('date_release', 'date_revision')] }
  );

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  errorMessages = {
    required: () => 'Este Campo es requerido',
    minlength: (min: number, max: number) => `Requiere minimo ${min}`,
    maxlength: (min: number, max: number) => `Requiere máximo ${max}`,
  };

  onReset() {
    this.registrationForm.reset();
  }
  onSubmit() {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.value) {
      this.isLoading.set(true);
      this.productService
        .createProduct(this.registrationForm.value)
        .pipe(
          finalize(() => this.isLoading.set(false)),
          takeUntil(this.onDestroy$)
        )
        .subscribe((resp) => console.log('productoCreado'));
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
