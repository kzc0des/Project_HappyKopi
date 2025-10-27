import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListCard } from './category-list-card';

describe('CategoryListCard', () => {
  let component: CategoryListCard;
  let fixture: ComponentFixture<CategoryListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
