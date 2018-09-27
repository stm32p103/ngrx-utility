import { ToAction, ReducerFactory, toActionName } from '../dist';

// define action
export class CounterActions {
    @ToAction()
    static increment(): any {
        // no payload
    }

    @ToAction()
    static decrement(): any {
        // no payload
    }
    
    @ToAction()
    static preset( n: number ): any {
        // payload = n
        return n;
    }
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

// add( action, ( state: T, payload? any ) => T );
factory.add( CounterActions.increment, ( count: number ) => count + 1 );
factory.add( CounterActions.decrement, ( count: number ) => count - 1 );
factory.add( CounterActions.preset,    ( count: number, preset: number ) => preset );

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


console.log( '----------------------------------------------' );
console.log( 'Get action name' );
console.log( toActionName( CounterActions.increment ) );
console.log( toActionName( CounterActions.decrement ) );
console.log( toActionName( CounterActions.preset ) );


console.log( '----------------------------------------------' );
console.log( 'Get action names' );
console.log( toActionName( CounterActions.increment, CounterActions.decrement, CounterActions.preset ) );


