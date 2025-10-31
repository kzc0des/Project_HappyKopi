import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesListPageEdit } from './categories-list-page-edit';

describe('CategoriesListPageEdit', () => {
  let component: CategoriesListPageEdit;
  let fixture: ComponentFixture<CategoriesListPageEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesListPageEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesListPageEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
