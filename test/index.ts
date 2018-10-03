import { ToAction, ReducerFactory } from '../dist';

// define action
export class CounterActions {
    static increment = ToAction( '[Counter] Increment', () => {} );
    static decrement = ToAction( '[Counter] Decrement', () => {} );
    static preset    = ToAction( '[Counter] Preset',    ( n: number ) => n );
}

console.log( '----------------------------------------------' );
console.log( 'Try increment, decrement, preset...' );
console.log( CounterActions.increment() ); // { type: increment.CounterActions, payload: undefined }
console.log( CounterActions.decrement() ); // { type: decrement.CounterActions, payload: undefined }
console.log( CounterActions.preset( 5 ) ); // { type: preset.CounterActions, payload: 5 }

console.log( '----------------------------------------------' );
console.log( 'to dispatch in ngrx, call store.dispatch( CounterActions.increment() )' );

//build reducer factory
const factory = new ReducerFactory<number>();

// add( actionCreator, ( state: S, payload? T ) => S );
// I think it could be typesafe
factory.add( CounterActions.increment, ( count ) => count + 1 );
factory.add( CounterActions.decrement, ( count ) => count - 1 );
factory.add( CounterActions.preset,    ( count, preset ) => preset );

// define reducer
const counterReducer = factory.create( 0 );  // initial value = 0


// try reducer (instead of embed in ngrx, just call reducer)
let count: number;
console.log( '----------------------------------------------' );
console.log( 'Try increment() x 3...' );
for( let i = 0; i < 3; i++ ) {
    count = counterReducer( count, CounterActions.increment() );
    console.log( count );    
}

console.log( '----------------------------------------------' );
console.log( 'Try preset( 10 )...' );
count = counterReducer( count, CounterActions.preset( 10 ) );
console.log( count );

console.log( '----------------------------------------------' );
console.log( 'Try decrement() x 5...' );
for( let i = 0; i < 5; i++ ) {
    count = counterReducer( count, CounterActions.decrement() );
    console.log( count );    
}


