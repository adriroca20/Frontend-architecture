import {Injectable} from '@angular/core';
/* NgRx */
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, concatMap, map, mergeMap} from 'rxjs/operators';

import {RaceService} from '../race.call';

import {RaceApiActions, RacePageActions} from './actions';

@Injectable()
export class RaceEffects {
  constructor(
      private actions$: Actions,
      private raceService: RaceService,
  ) {}

  loadRaces$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(RacePageActions.loadRaces),
        mergeMap(
            () => this.raceService.getRaces().pipe(
                map(races => RaceApiActions.loadRacesSuccess({races})),
                catchError(error => of(RaceApiActions.loadRacesFailure({error}))))));
  });

  updateRace$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(RacePageActions.updateRace),
        concatMap(
            action => this.raceService.updateRace(action.race)
                          .pipe(
                              map(race => RaceApiActions.updateRaceSuccess({race})),
                              catchError(error => of(RaceApiActions.updateRaceFailure({error}))))));
  });

  createRace$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(RacePageActions.createRace),
        concatMap(
            action => this.raceService.createRace(action.race)
                          .pipe(
                              map(race => RaceApiActions.createRaceSuccess({race})),
                              catchError(error => of(RaceApiActions.createRaceFailure({error}))))));
  });

  deleteRace$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(RacePageActions.deleteRace),
        mergeMap(
            action => this.raceService.deleteRace(action.raceId)
                          .pipe(
                              map(() => RaceApiActions.deleteRaceSuccess({raceId: action.raceId})),
                              catchError(error => of(RaceApiActions.deleteRaceFailure({error}))))));
  });
}
