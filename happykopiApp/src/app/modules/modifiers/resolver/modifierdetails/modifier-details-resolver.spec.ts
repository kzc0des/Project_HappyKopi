import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { modifierDetailsResolver } from './modifier-details-resolver';

describe('modifierDetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => modifierDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
