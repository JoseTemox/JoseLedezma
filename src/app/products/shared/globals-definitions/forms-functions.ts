import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { debounceTime, map, Observable, of, switchMap, take } from 'rxjs';
import { ProductWebServices } from '../../services/product-web-services.service';

export function releaseDateValidator(
  release: AbstractControl
): ValidationErrors | null {
  const value = release.value as string;
  const currentDay = new Date();
  currentDay.setHours(0, 0, 0, 0);
  const adjustDate = dateAdjust(value);

  return adjustDate >= currentDay
    ? null
    : {
        revisionReleaseDate: true,
      };
}

export function yearVerification(
  releaseDateField: string,
  revisionDateField: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const releaseDateControl = control.get(releaseDateField);
    const revisionDateControl = control.get(revisionDateField);

    if (
      !releaseDateControl ||
      !revisionDateControl ||
      !releaseDateControl.value ||
      !revisionDateControl.value
    ) {
      return null;
    }

    const releaseDate = new Date(releaseDateControl.value);
    const revisionDate = new Date(revisionDateControl.value);

    if (isNaN(releaseDate.getTime()) || isNaN(revisionDate.getTime())) {
      return { invalidDate: true };
    }

    const expectedRevisionDate = new Date(releaseDate);
    expectedRevisionDate.setFullYear(releaseDate.getFullYear() + 1);

    if (revisionDate.getTime() === expectedRevisionDate.getTime()) {
      return null;
    } else {
      return { revisionDate: true };
    }
  };
}

/**
 *
 * @param stringDate 'YYYY/MM/DD'
 */
export function dateAdjust(stringDate: string): Date {
  const dateValue = new Date(stringDate);
  const userTimezoneOffset = dateValue.getTimezoneOffset() * 60000;
  const adjustDate = new Date(dateValue.getTime() + userTimezoneOffset);
  return adjustDate;
}

export function verifyIdExist(
  productService: ProductWebServices
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.trim() === '') {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      take(1),
      switchMap((value) =>
        productService
          .productIdValidator(value)
          .pipe(map((exist) => (exist ? { existProduct: true } : null)))
      )
    );
  };
}
