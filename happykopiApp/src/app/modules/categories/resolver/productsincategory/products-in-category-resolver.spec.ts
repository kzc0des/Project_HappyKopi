import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { productsInCategoryResolver } from './products-in-category-resolver';

describe('productsInCategoryResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => productsInCategoryResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
