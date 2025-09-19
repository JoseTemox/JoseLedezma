import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDropDownMenu } from './product-drop-down-menu';

describe('ProductDropDownMenu', () => {
  let component: ProductDropDownMenu;
  let fixture: ComponentFixture<ProductDropDownMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDropDownMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDropDownMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
