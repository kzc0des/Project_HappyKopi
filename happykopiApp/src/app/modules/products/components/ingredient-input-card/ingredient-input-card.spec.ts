import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientInputCard } from './ingredient-input-card';

describe('IngredientInputCard', () => {
  let component: IngredientInputCard;
  let fixture: ComponentFixture<IngredientInputCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientInputCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientInputCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
