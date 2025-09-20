import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalModalMessages } from './global-modal-messages';

describe('GlobalModalMessages', () => {
  let component: GlobalModalMessages;
  let fixture: ComponentFixture<GlobalModalMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalModalMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalModalMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
