import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListCardEdit } from './category-list-card-edit';

describe('CategoryListCardEdit', () => {
  let component: CategoryListCardEdit;
  let fixture: ComponentFixture<CategoryListCardEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListCardEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListCardEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
