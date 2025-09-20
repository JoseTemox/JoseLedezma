export interface ModalData {
  title?: string;
  message?: string;
  type: ModalType;
  confirmButtonText?: string;
  cancelButtonText?: string;
  hideCancelButton?: boolean;
  hideConfirmButton?: boolean;
  customClass?: string;
}

export interface ModalResult {
  confirmed: boolean;
}

export enum ModalType {
  CONFIRM = 'confirm',
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
}
