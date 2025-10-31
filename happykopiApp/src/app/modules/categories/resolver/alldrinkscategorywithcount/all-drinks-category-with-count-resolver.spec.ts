import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { allDrinksCategoryWithCountResolver } from './all-drinks-category-with-count-resolver';

describe('allDrinksCategoryWithCountResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => allDrinksCategoryWithCountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
