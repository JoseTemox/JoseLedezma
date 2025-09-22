import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalModalMessages } from './global-modal-messages';
import { Subject } from 'rxjs';
import {
  ModalData,
  ModalResult,
  ModalType,
} from './interfaces/global-modal-interfaces';
import { GlobalModalService } from './services/global-modal-service.service';

describe('GlobalModalMessages', () => {
  let component: GlobalModalMessages;
  let fixture: ComponentFixture<GlobalModalMessages>;
  let mockModalService: Partial<GlobalModalService>;
  let modalStateSubject: Subject<ModalData | null>;
  let modalResultSubject: Subject<ModalResult>;

  beforeEach(async () => {
    modalStateSubject = new Subject<ModalData | null>();
    modalResultSubject = new Subject<ModalResult>();

    mockModalService = {
      modalState$: modalStateSubject.asObservable(),
      closeModal: jasmine.createSpy('closeModal'),
    };
    await TestBed.configureTestingModule({
      imports: [GlobalModalMessages],
      providers: [{ provide: GlobalModalService, useValue: mockModalService }],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalModalMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    modalStateSubject.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe from modalState$ on ngOnDestroy', () => {
    spyOn(component['onDestroy$'], 'next');
    spyOn(component['onDestroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['onDestroy$'].next).toHaveBeenCalled();
    expect(component['onDestroy$'].complete).toHaveBeenCalled();
  });

  it('should call closeModal with confirmed: true on onConfirm', () => {
    component.onConfirm();
    expect(mockModalService.closeModal).toHaveBeenCalledWith({
      confirmed: true,
    });
  });

  it('should call closeModal with confirmed: false on onCancel', () => {
    component.onCancel();
    expect(mockModalService.closeModal).toHaveBeenCalledWith({
      confirmed: false,
    });
  });

  it('should close the modal if type is not "confirm" when clicking the overlay', () => {
    component.data = {
      title: 'Error',
      message: 'Error message',
      type: ModalType.ERROR,
    };

    component.onOverlayClick();
    expect(mockModalService.closeModal).toHaveBeenCalledWith({
      confirmed: false,
    });
  });

  it('should not close the modal if type is "confirm" when clicking the overlay', () => {
    component.data = {
      title: 'Confirm',
      message: 'Confirm message',
      type: ModalType.CONFIRM,
    };

    component.onOverlayClick();
    expect(mockModalService.closeModal).not.toHaveBeenCalled();
  });

  it('should return "btn-error" for error type', () => {
    component.data = { type: ModalType.ERROR };
    expect(component.getTypeClass()).toBe('btn-error');
  });

  it('should return "btn-warning" for warning type', () => {
    component.data = { type: ModalType.WARNING };
    expect(component.getTypeClass()).toBe('btn-warning');
  });

  it('should return "btn-success" for success type', () => {
    component.data = { type: ModalType.SUCCESS };
    expect(component.getTypeClass()).toBe('btn-success');
  });

  it('should return "btn-confirm" for confirm type', () => {
    component.data = { type: ModalType.CONFIRM };
    expect(component.getTypeClass()).toBe('btn-confirm');
  });

  it('should return an empty string for an unknown type or null data', () => {
    component.data = { type: 'unknown' as any };
    expect(component.getTypeClass()).toBe('');

    component.data = null;
    expect(component.getTypeClass()).toBe('');
  });
});
