import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoriesPage } from './product-categories-page';

describe('ProductCategoriesPage', () => {
  let component: ProductCategoriesPage;
  let fixture: ComponentFixture<ProductCategoriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoriesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
