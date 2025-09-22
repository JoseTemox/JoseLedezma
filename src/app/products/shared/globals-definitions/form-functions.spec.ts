import { fakeAsync, tick } from '@angular/core/testing';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  dateAdjust,
  releaseDateValidator,
  verifyIdExist,
  yearVerification,
} from './forms-functions';
import { ProductWebServices } from '../../services/product-web-services.service';

describe('Global Functions Form', () => {
  it('should adjust a date string to a proper Date object', () => {
    const stringDate = '2024-01-01T00:00:00.000Z';
    const expectedDate = new Date('2025-01-01');
    const result = dateAdjust(stringDate);
    expect(result.getFullYear()).toBe(expectedDate.getFullYear());
  });

  it('should return a validation error if the revision date is not exactly one year after the release date', () => {
    const control = {
      get: (key: string) => {
        if (key === 'date_release') {
          return { value: '2024-09-21' };
        }
        return { value: '2026-09-21' };
      },
    } as AbstractControl;
    expect(yearVerification('date_release', 'date_revision')(control)).toEqual({
      revisionDate: true,
    });
  });

  it('should return null if either date value is missing', () => {
    const control = {
      get: (key: string) => {
        if (key === 'date_release') {
          return { value: null };
        }
        return { value: '2025-09-21' };
      },
    } as AbstractControl;
    expect(
      yearVerification('date_release', 'date_revision')(control)
    ).toBeNull();
  });

  it('should return null if the release date is in the future or today', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const control = {
      value: futureDate.toISOString().split('T')[0],
    } as AbstractControl;
    expect(releaseDateValidator(control)).toBeNull();
  });

  it('should return a validation error if the release date is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);
    const control = {
      value: pastDate.toISOString().split('T')[0],
    } as AbstractControl;
    expect(releaseDateValidator(control)).toEqual({
      revisionReleaseDate: true,
    });
  });

  describe('verifyIdExist', () => {
    it('should return null for an empty or null control value', fakeAsync(() => {
      const productServiceMock: Pick<ProductWebServices, 'productIdValidator'> =
        {
          productIdValidator: (value: string) => of(false),
        };

      const validator: AsyncValidatorFn = verifyIdExist(
        productServiceMock as ProductWebServices
      );

      let result: ValidationErrors | null | undefined;

      (
        validator({
          value: null,
        } as AbstractControl) as Observable<ValidationErrors | null>
      ).subscribe((res) => {
        result = res;
      });
      tick(500);
      expect(result).toBeNull();

      result = undefined;

      (
        validator({
          value: '',
        } as AbstractControl) as Observable<ValidationErrors | null>
      ).subscribe((res) => {
        result = res;
      });
      tick(500);
      expect(result).toBeNull();
    }));
    it('should return { existProduct: true } if the ID already exists', fakeAsync(() => {
      const productServiceMock: Pick<ProductWebServices, 'productIdValidator'> =
        {
          productIdValidator: (value: string) => of(true),
        };

      const validator: AsyncValidatorFn = verifyIdExist(
        productServiceMock as ProductWebServices
      );

      let result: ValidationErrors | null | undefined;

      (
        validator({
          value: 'existing-id',
        } as AbstractControl) as Observable<ValidationErrors | null>
      ).subscribe((res) => {
        result = res;
      });

      tick(500);

      expect(result).toEqual({ existProduct: true });
    }));
  });
});
