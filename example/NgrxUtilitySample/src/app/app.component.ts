import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CounterActions } from './counter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    count$: Observable<number>;
    constructor( private store: Store<any> ) {
        this.count$ = this.store.pipe( select('count') );
    }
    
    increment() {
        this.store.dispatch( CounterActions.increment() );
    }
    
    decrement() {
        this.store.dispatch( CounterActions.decrement() );
    }
    
    reset() {
        this.store.dispatch( CounterActions.preset( 0 ) );
    }
}
