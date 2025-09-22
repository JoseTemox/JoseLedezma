import { TestBed } from '@angular/core/testing';
import { GlobalModalService } from './global-modal-service.service';
import {
  ModalData,
  ModalType,
  ModalResult,
} from '../interfaces/global-modal-interfaces';

describe('GlobalModalService', () => {
  let service: GlobalModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a modal and return an observable for the result', (done) => {
    const mockModalData: ModalData = {
      title: 'Test',
      message: 'Test message',
      type: ModalType.CONFIRM,
    };
    const mockModalResult: ModalResult = { confirmed: true };

    const result$ = service.openModal(mockModalData);

    result$.subscribe((result) => {
      expect(result).toEqual(mockModalResult);
      done();
    });

    service.closeModal(mockModalResult);
  });

  it('should close the modal by emitting null and the result', (done) => {
    const mockModalResult: ModalResult = { confirmed: false };
    let modalStateEmissions = 0;

    service.modalState$.subscribe((data) => {
      modalStateEmissions++;
      if (modalStateEmissions === 2) {
        expect(data).toBeNull();
      }
    });

    service.modalResult$.subscribe((result) => {
      expect(result).toEqual(mockModalResult);
      done();
    });

    (service as any).modalState.next({
      title: '',
      message: '',
      type: ModalType.SUCCESS,
    });
    service.closeModal(mockModalResult);
  });

  it('should open a confirm modal with default values if only message is provided', (done) => {
    service.modalState$.subscribe((data) => {
      const expectedData: ModalData = {
        title: 'Confirmación',
        message: 'Estas seguro?',
        type: ModalType.CONFIRM,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showCancellationButton: true,
        showConfirmButton: true,
      };
      expect(data).toEqual(expectedData);
      done();
    });

    service.confirm('Estas seguro?');
  });

  it('should open a confirm modal with custom values', (done) => {
    service.modalState$.subscribe((data) => {
      const expectedData: ModalData = {
        title: 'Custom Title',
        message: 'Custom Message',
        type: ModalType.CONFIRM,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        showCancellationButton: true,
        showConfirmButton: true,
      };
      expect(data).toEqual(expectedData);
      done();
    });

    service.confirm('Custom Message', 'Custom Title', 'OK', 'Cancel');
  });

  it('should open an error modal with default values', (done) => {
    const expectedData: ModalData = {
      title: 'Error',
      message: 'An error occurred',
      type: ModalType.ERROR,
      showCancellationButton: false,
      showConfirmButton: false,
      confirmButtonText: 'Cerrar',
    };

    service.modalState$.subscribe((data) => {
      expect(data).toEqual(expectedData);
      done();
    });

    service.error('An error occurred');
  });

  it('should open a success modal with custom values', (done) => {
    const expectedData: ModalData = {
      title: 'Success!',
      message: 'Operation was successful',
      type: ModalType.SUCCESS,
      showCancellationButton: false,
      showConfirmButton: false,
      confirmButtonText: 'Got It',
    };

    service.modalState$.subscribe((data) => {
      expect(data).toEqual(expectedData);
      done();
    });

    service.success('Operation was successful', 'Success!', 'Got It');
  });

  it('should open a warning modal with default values', (done) => {
    const expectedData: ModalData = {
      title: 'Advertencia',
      message: 'Warning!',
      type: ModalType.WARNING,
      showCancellationButton: false,
      showConfirmButton: false,
      confirmButtonText: 'Entendido',
    };

    service.modalState$.subscribe((data) => {
      expect(data).toEqual(expectedData);
      done();
    });

    service.warning('Warning!');
  });
});
