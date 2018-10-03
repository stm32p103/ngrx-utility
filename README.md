# ngrx-utility
Provide efficient way to define actions and reducers for ngrx.

# Example
```
npm run build
cd example\NgrxUtilitySample
npm install
ng serve
```

# Usage
## Define actions
Create static property using `ToAction<T>( actionName, payloader: (...arg:any[] ) => T ): ActionWithPayload<T>`. No decorator, less magical I think...
```
export class CounterActions {
    static increment = ToAction( '[Counter] Increment', () => {} );
    static decrement = ToAction( '[Counter] Decrement', () => {} );
    static preset    = ToAction( '[Counter] Preset',    ( n: number ) => n );
}
```

## Define reducers
To define reducer, 
1. Instanciate `ReducerFactory<TypeOfState>`
1. Add reducer function by `add( action | actions[], reducer( state, payload ) => nextState )` per actions.
1. Create reducer by `create( initialValue )` and export it.

### Example
```
const factory = new ReducerFactory<number>();

factory.add( CounterActions.increment, ( count ) => count + 1 );
factory.add( CounterActions.decrement, ( count ) => count - 1 );
factory.add( CounterActions.preset,    ( count, preset ) => preset );

// create( initial value );
export const counterReducer = factory.create( 0 );
```
Note that, Typescript infers type of payload from specified actions. 
![Type inference](https://raw.githubusercontent.com/stm32p103/ngrx-utility/master/img/type-inference-1.png)

If you specify wrong type in reducer arguments, typescript warns you as shown below.
![Type inference error](https://raw.githubusercontent.com/stm32p103/ngrx-utility/master/img/type-inference-2.png)

Also actions are incompatible, typescript warns you as shown below.
![Type inference error](https://raw.githubusercontent.com/stm32p103/ngrx-utility/master/img/type-inference-3.png)

## Embed in ngrx
As usual...

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
Dispatch actions generated by static methods which applied `ToAction` decorator.

```
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
        this.store.dispatch( CounterActions.preset( 10 ) );
    }
}
```

## Effects
Pipe `payloadOf` operator after `actions$` observable.
```
@Injectable()
export class EffectTest {
    constructor(
        private actions$: Actions
    ) {}

    @Effect( { dispatch: false } ) increment$ = this.actions$.pipe(
        payloadOf( CounterActions.preset ),
        map( payload => console.log( JSON.stringify( payload ) ) )
    );
}
```
