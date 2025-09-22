import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ModalData,
  ModalResult,
  ModalType,
} from '../interfaces/global-modal-interfaces';

@Injectable({
  providedIn: 'root',
})
export class GlobalModalService {
  private readonly modalState = new Subject<ModalData | null>();
  private readonly modalResult = new Subject<ModalResult>();
  modalState$: Observable<ModalData | null> = this.modalState.asObservable();
  modalResult$: Observable<ModalResult> = this.modalResult.asObservable();

  openModal(data: ModalData): Observable<ModalResult> {
    this.modalState.next(data);
    return this.modalResult$;
  }

  closeModal(result: ModalResult): void {
    this.modalState.next(null);
    this.modalResult.next(result);
  }

  confirm(
    message: string | undefined,
    title?: string,
    confirmButtonText?: string,
    cancelButtonText?: string
  ): Observable<ModalResult> {
    return this.openModal({
      title: title || 'Confirmación',
      message: message ?? undefined,
      type: ModalType.CONFIRM,
      confirmButtonText: confirmButtonText || 'Confirmar',
      cancelButtonText: cancelButtonText || 'Cancelar',
      showCancellationButton: true,
      showConfirmButton: true,
    });
  }

  error(
    message: string,
    title?: string,
    confirmButtonText?: string
  ): Observable<ModalResult> {
    return this.openModal({
      title: title || 'Error',
      message: message,
      type: ModalType.ERROR,
      showCancellationButton: false,
      showConfirmButton: false,
      confirmButtonText: confirmButtonText || 'Cerrar',
    });
  }
  warning(
    message: string,
    title?: string,
    confirmButtonText?: string
  ): Observable<ModalResult> {
    return this.openModal({
      title: title || 'Advertencia',
      message: message,
      type: ModalType.WARNING,
      showCancellationButton: false,
      showConfirmButton: false,
      confirmButtonText: confirmButtonText || 'Entendido',
    });
  }

  success(
    message: string,
    title?: string,
    confirmButtonText?: string
  ): Observable<ModalResult> {
    return this.openModal({
      title: title || 'Éxito',
      message: message,
      type: ModalType.SUCCESS,
      showCancellationButton: false,
      showConfirmButton: false,
      confirmButtonText: confirmButtonText || 'Aceptar',
    });
  }
}
