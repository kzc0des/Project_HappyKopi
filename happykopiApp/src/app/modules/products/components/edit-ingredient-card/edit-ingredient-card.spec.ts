import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIngredientCard } from './edit-ingredient-card';

describe('EditIngredientCard', () => {
  let component: EditIngredientCard;
  let fixture: ComponentFixture<EditIngredientCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditIngredientCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIngredientCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
