import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ModifierSummaryDto } from '../../../../core/dtos/modifier/modifier-summary-dto';
import { ModifierService } from '../../services/modifier.service';
import { ModifierType } from '../../../../core/enums/modifier-type';

export const modifierSummaryResolver: ResolveFn<ModifierSummaryDto[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<ModifierSummaryDto[]> => {

  const modifierService = inject(ModifierService);

  const typeParam = route.paramMap.get('type');
  console.log(typeParam);

  if (typeParam === null) {
    console.error('Modifier type parameter is missing in the route.');
    return of([]);
  }

  let modifierType: ModifierType;

  switch (typeParam.toLowerCase()) {
    case 'add-on': 
      modifierType = ModifierType.AddOns;
      break;
    case 'size':
      modifierType = ModifierType.Sizes;
      break;
    default:
      console.error(`Unknown modifier type in route: ${typeParam}`);
      return of([]);
  }

  return modifierService.getModifiersByType(modifierType);
};