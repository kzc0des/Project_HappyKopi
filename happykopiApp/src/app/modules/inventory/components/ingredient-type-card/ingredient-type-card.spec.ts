import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientTypeCard } from './ingredient-type-card';

describe('IngredientTypeCard', () => {
  let component: IngredientTypeCard;
  let fixture: ComponentFixture<IngredientTypeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientTypeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientTypeCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
