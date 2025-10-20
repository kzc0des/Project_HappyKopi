import { ResolveFn } from '@angular/router';
import { ModifierCount } from '../../../../../core/dtos/modifier/modifier-count.model';
import { catchError, Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { ModifierService } from '../../../services/modifier.service';

export const modifierTypeCountResolver: ResolveFn<ModifierCount[]> = (route, state) : Observable<ModifierCount[]>=> {
  const modifierService = inject(ModifierService);
  
  return modifierService.getModifierCountByType().pipe(
      catchError(err => {
        console.error('Failed to retrieve stockitem types', err);
        return of ([]);
      })
    );
};
