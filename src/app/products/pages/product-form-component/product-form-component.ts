import { CommonModule } from '@angular/common';
import { AbsoluteSourceSpan } from '@angular/compiler';
import { Component, inject } from '@angular/core';
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
  yearVerification,
} from '../../shared/globals-definitions/forms-functions';

@Component({
  selector: 'app-product-form-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './product-form-component.html',
  styleUrl: './product-form-component.scss',
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  registrationForm: FormGroup = this.fb.group(
    {
      id: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
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
      releaseDate: [null, [Validators.required, releaseDateValidator]],
      revisionDate: [null],
    },
    { validators: [yearVerification('releaseDate', 'revisionDate')] }
  );

  errorMessages = {
    required: () => 'Este Campo es requerido',
    minlength: (min: number, max: number) => `Requiere minimo ${min}`,
    maxlength: (min: number, max: number) => `Requiere máximo ${max}`,
  };

  onReset() {
    console.log('----------');
  }
  onSubmit() {
    this.registrationForm.markAllAsTouched();
  }

  errorMessage(control: string, min?: number, max?: number) {
    const fieldControl = this.registrationForm.get(control);
    console.log(control, '-->', fieldControl?.errors);
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
    return '';
  }

  isControlError(control: string) {
    const fieldControl = this.registrationForm.get(control);

    return (
      fieldControl?.invalid && (fieldControl?.dirty || fieldControl?.touched)
    );
  }
}
