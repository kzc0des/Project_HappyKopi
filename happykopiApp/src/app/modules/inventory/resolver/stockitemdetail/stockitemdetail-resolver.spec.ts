import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { stockitemdetailResolver } from './stockitemdetail-resolver';

describe('stockitemdetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => stockitemdetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
