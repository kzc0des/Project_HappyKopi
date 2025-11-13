import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToSelect } from './product-to-select';

describe('ProductToSelect', () => {
  let component: ProductToSelect;
  let fixture: ComponentFixture<ProductToSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductToSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductToSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
