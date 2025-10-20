import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { modifierTypeCountResolver } from './modifier-type-count-resolver';

describe('modifierTypeCountResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => modifierTypeCountResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
