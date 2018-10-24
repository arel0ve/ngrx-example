import { Component, OnInit } from '@angular/core';
import {Observable, race} from 'rxjs';
import {Tutorial} from '../models/tutorial.model';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import * as TutorialActions from '../actions/tutorial.actions';
import {animate, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css'],
  animations: [
    trigger('insertRemove', [
      transition(':enter', [
        style({
          opacity: 0,
          height: '0',
          padding: '0'
        }),
        animate('.5s ease-out', style({
          opacity: 1,
          height: '*',
          padding: '*'
        })),
      ]),
      transition(':leave', [
        animate('.5s ease-in', style({
          opacity: 0,
          height: '0',
          padding: '0'
        }))
      ])
    ])
  ]
})
export class ReadComponent implements OnInit {

  tutorials: Observable<Tutorial[]>;

  constructor(private store: Store<AppState>, private http: HttpClient) { }

  ngOnInit() {
    this.tutorials = this.store.select('tutorial');
  }

  removeTutorial(index) {
    this.store.dispatch(new TutorialActions.RemoveTutorial(index));
  }

  shuffle() {
    this.store.dispatch(new TutorialActions.ShuffleTutorial());
  }

  clear() {
    this.store.dispatch(new TutorialActions.ClearTutorial());
  }

  regenerate() {
    this.tutorials.subscribe(value => {
      for (let i = 0; i < value.length; i++) {
        this.loadTutorial().subscribe((rez: User) => {
          console.log(`Race was won by ${rez.results[0].gender}`);
          const tutorial = { name: rez.results[0].cell, url: `${rez.results[0].gender}/${rez.results[0].email}` };
          this.store.dispatch(new TutorialActions.ChangeTutorial({oldNumber: i, newTutorial: tutorial}));
        });
      }
    });
  }

  loadTutorial() {
    return race(
      this.http.get('https://randomuser.me/api/?gender=female'),
      this.http.get('https://randomuser.me/api/?gender=male')
    );
  }
}


