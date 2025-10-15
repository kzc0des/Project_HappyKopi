import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQuantityModifier } from './order-quantity-modifier';

describe('OrderQuantityModifier', () => {
  let component: OrderQuantityModifier;
  let fixture: ComponentFixture<OrderQuantityModifier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderQuantityModifier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderQuantityModifier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
