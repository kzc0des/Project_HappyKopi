import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedIngredientCard } from './selected-ingredient-card';

describe('SelectedIngredientCard', () => {
  let component: SelectedIngredientCard;
  let fixture: ComponentFixture<SelectedIngredientCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedIngredientCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedIngredientCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
