import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeItem } from './charge-item';

describe('ChargeItem', () => {
  let component: ChargeItem;
  let fixture: ComponentFixture<ChargeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
