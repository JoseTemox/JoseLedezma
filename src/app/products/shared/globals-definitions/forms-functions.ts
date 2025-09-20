import { AbstractControl, ValidationErrors } from '@angular/forms';

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
