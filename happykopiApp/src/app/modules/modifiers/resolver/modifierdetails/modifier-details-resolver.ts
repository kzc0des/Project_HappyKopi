import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ModifierDetailsDto } from '../../../../core/dtos/modifier/modifier-details-dto';
import { ModifierService } from '../../services/modifier.service';

export const modifierDetailsResolver: ResolveFn<ModifierDetailsDto | null> = (
  route: ActivatedRouteSnapshot
): Observable<ModifierDetailsDto | null> => {

  const modifierService = inject(ModifierService);
  const idParam = route.paramMap.get('itemId');

  if (!idParam) {
    console.error('Modifier ID parameter is missing in the route.');
    return of(null);
  }

  const id = Number(idParam);

  if (isNaN(id)) {
    console.error('Modifier ID parameter is not a valid number:', idParam);
    return of(null);
  }

  return modifierService.getModifierById(id);
};