import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemCard } from './order-item-card';

describe('OrderItemCard', () => {
  let component: OrderItemCard;
  let fixture: ComponentFixture<OrderItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
