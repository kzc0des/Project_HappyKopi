import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsInfoCard } from './products-info-card';

describe('ProductsInfoCard', () => {
  let component: ProductsInfoCard;
  let fixture: ComponentFixture<ProductsInfoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsInfoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsInfoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
