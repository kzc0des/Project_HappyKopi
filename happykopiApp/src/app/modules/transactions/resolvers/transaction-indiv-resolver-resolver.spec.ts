import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { transactionIndivResolverResolver } from './transaction-indiv-resolver-resolver';

describe('transactionIndivResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => transactionIndivResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
