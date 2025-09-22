import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { DropDownMenu } from './drop-down-menu';
import { Subject } from 'rxjs';
import { Product } from '../../interfaces/products.interfaces';
import { DropdownMenuService } from './drop-down-menu.service';

class MockDropdownMenuService {
  closeAllDropdownsSubject = new Subject<string | null>();
  closeAllDropdowns$ = this.closeAllDropdownsSubject.asObservable();
  requestCloseAll(idToExclude: string | null = null) {
    this.closeAllDropdownsSubject.next(idToExclude);
  }
}

describe('DropDownMenu', () => {
  let component: DropDownMenu;
  let fixture: ComponentFixture<DropDownMenu>;
  let mockDropdownService: MockDropdownMenuService;
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'A product for testing purposes',
    logo: 'logo.png',
    date_release: new Date(),
    date_revision: new Date(),
  };

  beforeEach(async () => {
    mockDropdownService = new MockDropdownMenuService();
    await TestBed.configureTestingModule({
      imports: [DropDownMenu],
      providers: [
        { provide: DropdownMenuService, useValue: mockDropdownService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropDownMenu);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dropdown when toggleDropdown is called and it is closed', fakeAsync(() => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');
    spyOn(mockDropdownService, 'requestCloseAll');

    component.isOpen = false;
    component.toggleDropdown(event);
    tick();

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(mockDropdownService.requestCloseAll).toHaveBeenCalledWith(
      component['uniqueId']
    );
    expect(component.isOpen).toBeTrue();
  }));

  it('should close the dropdown when toggleDropdown is called and it is open', fakeAsync(() => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.isOpen = true;
    component.toggleDropdown(event);
    tick();

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.isOpen).toBeFalse();
  }));

  it('should close the dropdown on a click outside the component', fakeAsync(() => {
    component.isOpen = true;
    fixture.detectChanges();

    const outsideElement = document.createElement('div');
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });

    document.dispatchEvent(event);
    tick();

    expect(component.isOpen).toBeFalse();
  }));

  it('should not close the dropdown on a click inside the component', fakeAsync(() => {
    component.isOpen = true;
    fixture.detectChanges();

    const insideElement = fixture.nativeElement.querySelector('.dropdown-menu');

    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: insideElement });

    document.dispatchEvent(event);
    tick();

    expect(component.isOpen).toBeTrue();
  }));

  it('should emit the product on onEdit and close the dropdown', () => {
    spyOn(component.edit, 'emit');
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.onEdit(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.edit.emit).toHaveBeenCalledWith(mockProduct);
    expect(component.isOpen).toBeFalse();
  });

  it('should emit the product on onDelete and close the dropdown', () => {
    spyOn(component.delete, 'emit');
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.onDelete(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.delete.emit).toHaveBeenCalledWith(mockProduct);
    expect(component.isOpen).toBeFalse();
  });

  it('should close the dropdown when another dropdown requests to close', fakeAsync(() => {
    component.isOpen = true;
    fixture.detectChanges();

    mockDropdownService.requestCloseAll('another-id');
    tick();

    expect(component.isOpen).toBeFalse();
  }));

  it('should not close the dropdown when its own ID is excluded from closing', fakeAsync(() => {
    component.isOpen = true;
    fixture.detectChanges();

    mockDropdownService.requestCloseAll(component['uniqueId']);
    tick();

    expect(component.isOpen).toBeTrue();
  }));
});
