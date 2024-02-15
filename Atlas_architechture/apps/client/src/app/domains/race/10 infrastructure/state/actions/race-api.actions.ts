
/* NgRx */

import {createAction, props} from '@ngrx/store';

import {Race} from '../../../00 model';

export const loadRacesSuccess = createAction('[Race API] Load Success', props<{races: Race[]}>());

export const loadRacesFailure = createAction('[Race API] Load Fail', props<{error: string}>());

export const updateRaceSuccess = createAction('[Race API] Update Race Success', props<{race: Race}>());

export const updateRaceFailure = createAction('[Race API] Update Race Fail', props<{error: string}>());

export const createRaceSuccess = createAction('[Race API] Create Race Success', props<{race: Race}>());

export const createRaceFailure = createAction('[Race API] Create Race Fail', props<{error: string}>());

export const deleteRaceSuccess = createAction('[Race API] Delete Race Success', props<{raceId: number}>());

export const deleteRaceFailure = createAction('[Race API] Delete Race Fail', props<{error: string}>());
