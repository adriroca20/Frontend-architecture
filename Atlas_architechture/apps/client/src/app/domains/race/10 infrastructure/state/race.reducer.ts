/* NgRx */

import {createReducer, on} from '@ngrx/store';

import {Race} from '../../00 model';

import {RaceApiActions, RacePageActions} from './actions';

// State for this feature (Race)
export interface RaceState {
  showRaceCode: boolean;
  currentRaceId: number|null;
  races: Race[];
  error: string;
}

const initialState: RaceState = {
  showRaceCode: true,
  currentRaceId: null,
  races: [],
  error: ''
};

export const raceReducer = createReducer<RaceState>(
    initialState,
    on(RacePageActions.toggleRaceCode,
       (state: RaceState):
           RaceState => {
             return {...state, showRaceCode: !state.showRaceCode};
           }),
    on(RacePageActions.setCurrentRace,
       (state: RaceState, action: {currentRaceId: any;}):
           RaceState => {
             return {...state, currentRaceId: action.currentRaceId};
           }),
    on(RacePageActions.clearCurrentRace,
       (state: RaceState):
           RaceState => {
             return {...state, currentRaceId: null};
           }),
    on(RacePageActions.initializeCurrentRace,
       (state: RaceState):
           RaceState => {
             return {...state, currentRaceId: 0};
           }),
    on(RaceApiActions.loadRacesSuccess,
       (state: RaceState, action: {races: any;}):
           RaceState => {
             return {...state, races: action.races, error: ''};
           }),
    on(RaceApiActions.loadRacesFailure,
       (state: RaceState, action: {error: any;}):
           RaceState => {
             return {...state, races: [], error: action.error};
           }),
    on(RaceApiActions.updateRaceSuccess,
       (state: RaceState, action: {race: any}):
           RaceState => {
             const updatedRaces = state.races.map(item => action.race.id === item.id ? action.race : item);
             return {...state, races: updatedRaces, currentRaceId: action.race.id, error: ''};
           }),
    on(RaceApiActions.updateRaceFailure,
       (state: RaceState, action: {error: any;}):
           RaceState => {
             return {...state, error: action.error};
           }),
    // After a create, the currentRace is the new race.
    on(RaceApiActions.createRaceSuccess,
       (state: RaceState, action: {race: Race;}):
           RaceState => {
             return {...state, races: [...state.races, action.race], currentRaceId: action.race.id, error: ''};
           }),
    on(RaceApiActions.createRaceFailure,
       (state: RaceState, action: {error: any;}):
           RaceState => {
             return {...state, error: action.error};
           }),
    // After a delete, the currentRace is null.
    on(RaceApiActions.deleteRaceSuccess,
       (state: RaceState, action: {raceId: number;}):
           RaceState => {
             return {...state, races: state.races.filter(race => race.id !== action.raceId), currentRaceId: null, error: ''};
           }),
    on(RaceApiActions.deleteRaceFailure, (state: RaceState, action: {error: any;}): RaceState => {
      return {...state, error: action.error};
    }));
