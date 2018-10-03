import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// to store action name...not so good way.
const DICTIONARY = new Map<any,string>();

export interface ActionWithPayload<T> {
    type: string;
    payload?: T;
}

export type ActionCreator<T> = ( ...args: any[] ) => ActionWithPayload<T>; 
export type Reducer<S,T> = ( state: S, payload: T ) => S;
export function ToAction<T>( type: string, creator: ( ...args: any[] ) => T ): ActionCreator<T> {
    const actionCreator = ( ...arg ) => {
        return {
            type: type,
            payload: creator( ...arg )
        }
    }
    DICTIONARY.set( actionCreator, type );
    return actionCreator;
}

// find action name by static method
function toActionName( actions: ActionCreator<any>[] ): string[] {
    let names = actions.map( action => {
        let tmp = DICTIONARY.get( action );
        
        console.log( tmp )
        if( tmp === undefined ) {
            throw new Error( 'No such action' );
        }
        return tmp;
    } );
    return names;
}

//pipable operator: https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md
export const payloadOf = <T>( ...actions: ActionCreator<T>[] ) => ( source: Observable<ActionWithPayload<T>> ) => {
    const actionNames: string[] = toActionName( actions );
    return source.pipe(
        filter( target => ( actionNames.includes( target.type ) ) ),
        map( target => target.payload )
    );
}

// help defining reducer
export class ReducerFactory<S> {
    private reducers: { [ action: string ]: Reducer<S,any> } = {};
    
    add<T>( actions: ActionCreator<T> | ActionCreator<T>[], reducer: Reducer<S,T> ) {
        let actionNames: string[];
    
        if( actions instanceof Array ) {
            actionNames = toActionName( actions );
        } else {
            actionNames = toActionName( [ actions ] );
        }
        actionNames.map( action => {
            this.reducers[ action ] = reducer;
        } );
    }
    
    create( initialState: S ): Reducer<S,any> {
        const reducers = { ...this.reducers };  // copy
        return ( state: S = initialState, action: ActionWithPayload<any> ) => {
            const reducer = reducers[ action.type ];
            let ret = state;
            
            if( reducer !== undefined ) {
                ret = reducer( state, action.payload );                
            }
            
            return ret;
        }
    }
}

