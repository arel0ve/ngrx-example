import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import * as TutorialActions from '../actions/tutorial.actions';
import {fromEvent, race, zip} from 'rxjs';
import {map, throttleTime, debounceTime} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  @ViewChild('name') nameRef: ElementRef;
  @ViewChild('url') urlRef: ElementRef;
  completedName = false;
  completedUrl = false;
  message = '';

  constructor(private store: Store<AppState>, private http: HttpClient) { }

  ngOnInit() {

    fromEvent(document.querySelectorAll('input'), 'input')
      .pipe(throttleTime(1000))
      .subscribe(() => this.message = 'Writing...');

    const nameComplete = fromEvent(this.nameRef.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(1000)
      );
    nameComplete.subscribe(() => {
      this.message = 'Field \'Name\' complete';
      this.completedName = true;
    });

    const urlComplete = fromEvent(this.urlRef.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(1000)
      );
    urlComplete.subscribe(() => {
      this.message = 'Field \'Url\' complete';
      this.completedUrl = true;
    });

    const complete = zip(nameComplete, urlComplete)
      .pipe(
        map(([name, url]) => {
          return {name, url};
        }),
        debounceTime(100)
      );
    complete.subscribe((value) => {
      this.message = `You completed all data. It will add to storage automatically at 2 seconds...`;
      console.log(value);
    });

    complete.pipe(debounceTime(2000)).subscribe(value => {
      if (value.name && value.url) {
        this.addTutorial(value); // saving data to @ngrx/store
        this.message = `Tutorial was added successful`;
        this.completedName = false;
        this.completedUrl = false;
      } else {
        this.message = `Fill both fields to continue or click 'Add tutorial'`;
      }
    });

  }

  addTutorial({name, url}) {
    if (name) {
      this.store.dispatch(new TutorialActions.AddTutorial({name: name, url: url}));
    } else {
      race(
        this.http.get('https://randomuser.me/api/?gender=female'),
        this.http.get('https://randomuser.me/api/?gender=male')
      ).subscribe((rez: User) => {
        console.log(`Race was won by ${rez.results[0].gender}`);
        const tutorial = { name: rez.results[0].cell, url: `${rez.results[0].gender}/${rez.results[0].email}` };
        this.store.dispatch(new TutorialActions.AddTutorial(tutorial));
      });
    }
  }

}
