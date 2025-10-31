import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { categoriesListWithCountResolver } from './categories-list-with-count-resolver';

describe('categoriesListWithCountResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => categoriesListWithCountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
