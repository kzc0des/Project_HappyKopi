import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchBar } from './product-search-bar';

describe('ProductSearchBar', () => {
  let component: ProductSearchBar;
  let fixture: ComponentFixture<ProductSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
