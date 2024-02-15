

import {createFeatureSelector, createSelector} from '@ngrx/store';

import {Race} from '../../00 model';
import * as AppState from '../../hades.state';

import {RaceState} from './race.reducer';

// Extends the app state to include the race feature.
// This is required because race are lazy loaded.
// So the reference to RaceState cannot be added to app.state.ts directly.
export interface HadesState extends AppState.HadesState {
  race: RaceState;
}

// Selector functions
const getRaceFeatureState = createFeatureSelector<RaceState>('races');

export const getShowRaceCode = createSelector(getRaceFeatureState, (state: RaceState) => state.showRaceCode);

export const getCurrentRaceId = createSelector(getRaceFeatureState, (state: RaceState) => state.currentRaceId);

export const getCurrentRace = createSelector(getRaceFeatureState, getCurrentRaceId, (state, currentRaceId) => {
  if (currentRaceId === 0) {
    return {id: 0, name: '', code: 'New', description: '', starRating: 0, laps: 0};
  } else {
    return currentRaceId ? state.races.find(p => p.id === currentRaceId) : null;
  }
});

export const getRaces = createSelector(getRaceFeatureState, (state: RaceState) => {
  return state.races;
});

export const getError = createSelector(getRaceFeatureState, (state: RaceState) => state.error);
