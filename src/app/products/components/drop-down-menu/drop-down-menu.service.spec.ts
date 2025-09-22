import { TestBed } from '@angular/core/testing';
import { DropdownMenuService } from './drop-down-menu.service';

describe('DropDownService - Menu', () => {
  let service: DropdownMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropdownMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request to close all dropdowns except the one with the given ID', (done) => {
    const idToExclude = 'randomID';

    service.closeAllDropdowns$.subscribe((id) => {
      expect(id).toBe(idToExclude);
      done();
    });

    service.requestCloseAll(idToExclude);
  });
});
