import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ModalData } from './interfaces/global-modal-interfaces';
import { GlobalModalService } from './services/global-modal-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-modal-messages',
  imports: [CommonModule],
  templateUrl: './global-modal-messages.html',
  styleUrl: './global-modal-messages.scss',
})
export class GlobalModalMessages implements OnInit, OnDestroy {
  private readonly modalService = inject(GlobalModalService);
  private readonly onDestroy$ = new Subject<void>();

  isOpen = signal(false);
  data: ModalData | null = null;
  errorType = {
    error: () => 'btn-error',
    warning: () => 'btn-warning',
    success: () => 'btn-success',
    confirm: () => 'btn-confirm',
  };

  ngOnInit(): void {
    this.modalService.modalState$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((modalData) => {
        this.data = modalData;
        this.isOpen.set(modalData !== null);
      });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onConfirm(): void {
    this.modalService.closeModal({ confirmed: true });
  }

  onCancel(): void {
    this.modalService.closeModal({ confirmed: false });
  }

  onOverlayClick(): void {
    if (this.data?.type !== 'confirm') {
      this.modalService.closeModal({ confirmed: false });
    }
  }

  getTypeClass(): string {
    if (this.data?.type && this.data?.type in this.errorType) {
      return this.errorType[this.data?.type]();
    }
    return '';
  }
}
