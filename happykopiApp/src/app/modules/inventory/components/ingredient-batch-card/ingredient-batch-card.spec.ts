import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientBatchCard } from './ingredient-batch-card';

describe('IngredientBatchCard', () => {
  let component: IngredientBatchCard;
  let fixture: ComponentFixture<IngredientBatchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientBatchCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientBatchCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
