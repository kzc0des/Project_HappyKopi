import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { categoryWithCountResolver } from './category-with-count-resolver';

describe('categoryWithCountResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => categoryWithCountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
