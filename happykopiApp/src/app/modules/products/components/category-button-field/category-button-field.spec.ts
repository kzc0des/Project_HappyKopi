import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryButtonField } from './category-button-field';

describe('CategoryButtonField', () => {
  let component: CategoryButtonField;
  let fixture: ComponentFixture<CategoryButtonField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryButtonField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryButtonField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
