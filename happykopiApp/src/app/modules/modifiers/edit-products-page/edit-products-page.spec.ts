import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductsPage } from './edit-products-page';

describe('EditProductsPage', () => {
  let component: EditProductsPage;
  let fixture: ComponentFixture<EditProductsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
