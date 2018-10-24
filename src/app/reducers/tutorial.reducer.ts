import {Tutorial} from '../models/tutorial.model';
import * as TutorialActions from '../actions/tutorial.actions';
import * as _ from 'lodash';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';

const initialState: Tutorial = {
  name: 'Initial tutorial',
  url: 'http://google.com'
};

const http = HttpClient;

export function reducer(state: Tutorial[] = [initialState], action: TutorialActions.Actions) {
  switch (action.type) {
    case TutorialActions.ADD_TUTORIAL:
      return [...state, action.payload];
    case TutorialActions.REMOVE_TUTORIAL:
      state.splice(action.payload, 1);
      return state;
    case TutorialActions.SHUFFLE_TUTORIAL:
      return state = _.shuffle(state);
    case TutorialActions.CLEAR_TUTORIAL:
      return [];
    case TutorialActions.CHANGE_TUTORIAL:
      state.splice(action.payload.oldNumber, 1, action.payload.newTutorial);
      return state;
    default:
      return state;
  }
}
