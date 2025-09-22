import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropdownMenuService {
  private readonly closeAllDropdownsSubject = new Subject<string | null>();

  closeAllDropdowns$: Observable<string | null> =
    this.closeAllDropdownsSubject.asObservable();

  requestCloseAll(idToExclude: string | null = null): void {
    this.closeAllDropdownsSubject.next(idToExclude);
  }
}
