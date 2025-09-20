import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropdownMenuService {
  // Un Subject para notificar a todos los dropdowns que se cierren,
  // excepto al que se le pase como 'idToExclude'.
  private closeAllDropdownsSubject = new Subject<string | null>();

  // Observable que los componentes pueden suscribir para recibir la señal de cierre
  closeAllDropdowns$: Observable<string | null> =
    this.closeAllDropdownsSubject.asObservable();

  constructor() {}

  /**
   * Envía una señal para que todos los dropdowns se cierren,
   * opcionalmente excluyendo uno específico que podría ser el que se está abriendo.
   * @param idToExclude El ID del dropdown que no debe cerrarse (el que se está abriendo/interactuando).
   */
  requestCloseAll(idToExclude: string | null = null): void {
    this.closeAllDropdownsSubject.next(idToExclude);
  }
}
