import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEditItem } from './inventory-edit-item';

describe('InventoryEditItem', () => {
  let component: InventoryEditItem;
  let fixture: ComponentFixture<InventoryEditItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryEditItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryEditItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
