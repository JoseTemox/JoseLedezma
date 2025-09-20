import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { debounceTime, map, Observable, of, switchMap, take } from 'rxjs';
import { ProductWebServices } from '../../services/product-web-services.service';
import { inject } from '@angular/core';

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

export function yearVerification(releaseDate: string, revisionDate: string) {
  return (control: AbstractControl) => {
    const releaseDateValue = control.get(releaseDate)?.value;
    const revisionDateValue = control.get(revisionDate)?.value;

    if (!releaseDateValue || !revisionDateValue) {
      return null;
    }

    const adjustReleaseDate = dateAdjust(releaseDateValue);
    const adjustRevisionDate = dateAdjust(revisionDateValue);
    const releaseYear = adjustReleaseDate.getFullYear();
    const revisionYear = adjustRevisionDate.getFullYear();

    return revisionYear - 1 === releaseYear ? null : { revisionDate: true };
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

// <Observable<ValidationErrors | null>> {
//   return productService
//     .productIdValidator(idControl.value)
//     .pipe(map((resp) => (resp ? { invalidId: true } : null)));
// }
