import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQuickViewDown } from './order-quick-view-down';

describe('OrderQuickViewDown', () => {
  let component: OrderQuickViewDown;
  let fixture: ComponentFixture<OrderQuickViewDown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderQuickViewDown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderQuickViewDown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
