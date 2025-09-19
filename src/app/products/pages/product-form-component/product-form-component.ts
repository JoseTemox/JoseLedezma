import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-product-form-component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './product-form-component.html',
  styleUrl: './product-form-component.scss',
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  registrationForm: FormGroup = this.fb.group({
    id: [null],
    name: [null],
    description: [null],
    logo: [null],
    releaseDate: [null],
    revisionDate: [null],
  });

  onReset() {}
  onSubmit() {}
}
