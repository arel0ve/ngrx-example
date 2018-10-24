import {Action} from '@ngrx/store';
import {Tutorial} from '../models/tutorial.model';

export const ADD_TUTORIAL = '[TUTORIAL] Add';
export const REMOVE_TUTORIAL = '[TUTORIAL] Remove';
export const SHUFFLE_TUTORIAL = '[TUTORIAL] Shuffle';
export const CLEAR_TUTORIAL = '[TUTORIAL] Clear';
export const CHANGE_TUTORIAL = '[TUTORIAL] Change';

export class AddTutorial implements Action {
  readonly type = ADD_TUTORIAL;
  constructor(public payload: Tutorial) { }
}

export class RemoveTutorial implements Action {
  readonly type = REMOVE_TUTORIAL;
  constructor(public payload: number) { }
}

export class ShuffleTutorial implements Action {
  readonly type = SHUFFLE_TUTORIAL;
  constructor() { }
}

export class ClearTutorial implements Action {
  readonly type = CLEAR_TUTORIAL;
  constructor() { }
}

export class ChangeTutorial implements Action {
  readonly type = CHANGE_TUTORIAL;
  constructor(public payload: {oldNumber: number, newTutorial: Tutorial}) { }
}

export type Actions = AddTutorial | RemoveTutorial | ShuffleTutorial | ClearTutorial | ChangeTutorial;
