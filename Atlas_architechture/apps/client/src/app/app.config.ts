import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideRouter} from '@angular/router';
import {environment} from '@environment';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {appRoutes} from './app.routes';
import {RaceEffects} from './domains/race/10 infrastructure/state/race.effects';
import {raceReducer} from './domains/race/10 infrastructure/state/race.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
        BrowserModule,

        // configure NgRx modules
        StoreModule.forRoot({}, {
          metaReducers: !environment.production ? [] : [],
          runtimeChecks: {
            strictActionImmutability: true,
            strictStateImmutability: true,
          },
        }),
        StoreModule.forFeature('races', raceReducer),

        EffectsModule.forRoot([RaceEffects]),

        !environment.production ? StoreDevtoolsModule.instrument() : [],
        ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
  ],
};
