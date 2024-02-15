import {Route} from '@angular/router';

import {DriverResolverFn} from './domains/driver/30 resolver/driver.resolver';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./nx-welcome.component').then(m => m.NxWelcomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./nx-welcome.component').then(m => m.NxWelcomeComponent),
  },
  {
    path: 'drivers',
    loadComponent: () => import('./domains/driver/40 presentation/driver.component').then(m => m.DriverComponent),
    resolve: [DriverResolverFn],
  },
  {
    path: 'races',
    loadComponent: () => import('./domains/race/30 presentation/race.component').then(m => m.RaceComponent),
    resolve: [DriverResolverFn],
  }
];
