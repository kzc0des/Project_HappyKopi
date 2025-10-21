import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBatchView } from './inventory-batch-view';

describe('InventoryBatchView', () => {
  let component: InventoryBatchView;
  let fixture: ComponentFixture<InventoryBatchView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBatchView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBatchView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
