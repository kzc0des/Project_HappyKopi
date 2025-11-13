import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBatchAdd } from './inventory-batch-add';

describe('InventoryBatchAdd', () => {
  let component: InventoryBatchAdd;
  let fixture: ComponentFixture<InventoryBatchAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBatchAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBatchAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
