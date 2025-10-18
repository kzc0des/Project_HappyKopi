import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAddItem } from './inventory-add-item';

describe('InventoryAddItem', () => {
  let component: InventoryAddItem;
  let fixture: ComponentFixture<InventoryAddItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryAddItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryAddItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
