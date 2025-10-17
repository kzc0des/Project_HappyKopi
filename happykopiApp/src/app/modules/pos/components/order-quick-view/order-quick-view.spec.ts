import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQuickView } from './order-quick-view';

describe('OrderQuickView', () => {
  let component: OrderQuickView;
  let fixture: ComponentFixture<OrderQuickView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderQuickView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderQuickView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
