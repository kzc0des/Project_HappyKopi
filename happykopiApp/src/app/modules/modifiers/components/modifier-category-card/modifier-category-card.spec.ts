import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCategoryCard } from './modifier-category-card';

describe('ModifierCategoryCard', () => {
  let component: ModifierCategoryCard;
  let fixture: ComponentFixture<ModifierCategoryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierCategoryCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierCategoryCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
