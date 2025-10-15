import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { stockItemTypeCountResolver } from './stock-item-type-count-resolver';

describe('stockItemTypeCountResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => stockItemTypeCountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
