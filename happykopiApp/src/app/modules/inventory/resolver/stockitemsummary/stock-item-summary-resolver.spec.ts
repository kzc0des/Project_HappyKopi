import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { stockItemSummaryResolver } from './stock-item-summary-resolver';

describe('stockItemSummaryResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => stockItemSummaryResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
