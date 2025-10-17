import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddIngredient } from './add-ingredient';

describe('AddIngredient', () => {
  let component: AddIngredient;
  let fixture: ComponentFixture<AddIngredient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIngredient]
    }).compileComponents();

    fixture = TestBed.createComponent(AddIngredient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});