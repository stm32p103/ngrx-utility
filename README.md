# ngrx-utility
Provide efficient way to define actions and reducers for ngrx.

# Usage
## Define actions
```
// ToAction decorator wrap static method and returns action { type: 'method.class', payload: return value }
export class CounterActions {
    @ToAction()
    static increment(): any {
        console.log( 'increment action' );
        // return value = { type: 'increment.CounterActions', payload: undefined }
    }

    @ToAction()
    static decrement(): any {
        console.log( 'decrement action' );
        // return value = { type: 'decrement.CounterActions', payload: undefined }
    }
    
    @ToAction()
    static preset( n: number ): any {
        console.log( 'preset action' );
        return n;
        // return value = { type: 'decrement.CounterActions', payload: n }
    }
}
```

## Define reducers
```
const factory = new ReducerFactory<number>();

// add( action | actions, reducer: ( state, action's payload ) => next state )
factory.add( CounterActions.increment, ( count: number ) => {
    return count + 1;
} );

factory.add( CounterActions.decrement, ( count: number ) => {
    return count - 1;
} );

factory.add( CounterActions.preset, ( count: number, preset: number ) => {
    return preset;
} );

// create( initial value );
export const counterReducer = factory.create( 0 );
```

## Embed in ngrx
```
@NgModule( {
  declarations: [
    AppComponent
  ],
  imports: [
    StoreModule.forRoot( { count: counterReducer } )
  ],
  providers: [],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
```

## Dispatch actions
```
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CounterActions } from './counter';
import { Observable } from 'rxjs';

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
        this.store.dispatch( CounterActions.preset( 10 ) );
    }
}
```
