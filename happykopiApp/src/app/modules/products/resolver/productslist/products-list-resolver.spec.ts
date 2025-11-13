import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { productsListResolver } from './products-list-resolver';

describe('productsListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => productsListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
