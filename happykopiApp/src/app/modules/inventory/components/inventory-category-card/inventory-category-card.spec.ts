import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCategoryCard } from './inventory-category-card';

describe('InventoryCategoryCard', () => {
  let component: InventoryCategoryCard;
  let fixture: ComponentFixture<InventoryCategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryCategoryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryCategoryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
