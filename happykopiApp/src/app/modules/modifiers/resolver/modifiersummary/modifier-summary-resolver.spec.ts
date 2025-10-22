import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { modifierSummaryResolver } from './modifier-summary-resolver';

describe('modifierSummaryResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => modifierSummaryResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
