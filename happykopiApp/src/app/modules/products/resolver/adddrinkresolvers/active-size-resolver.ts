import { ResolveFn } from '@angular/router';

export const activeSizeResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
