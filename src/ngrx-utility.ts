import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// to store action name...not so good way.
const DICTIONARY = new Map<any,string>();



export interface ActionWithPayload {
    type: string;
    payload?: any;
}



//local types
export type Reducer<T> = ( state: T, payload?: any ) => T;
export type ActionReducer<T> = ( state: T, action: ActionWithPayload ) => T;



// wrap static method to return Action with Payload
export function ToAction(): MethodDecorator {
    return function( target: any, propertyKey: string, descriptor: PropertyDescriptor ) {
        // original method
        let original = descriptor.value; 
        
        // action name = method.class
        const name = propertyKey + '.' + target.name;

        // --------------------------------------------------------------------
        // new method: wrap original method
        descriptor.value = function(): ActionWithPayload {
            const retVal = original.apply( this, arguments );
            const action: ActionWithPayload = {
                type: name,
                payload: retVal
            };
            return action;
        }
        // --------------------------------------------------------------------
        
        // register action name
        DICTIONARY.set( descriptor.value, name );
    }
}



// find action name by static method
function toActionName( actions: Function[] ): string[] {
    let names = actions.map( action => {
        let tmp = DICTIONARY.get( action );
        if( tmp === undefined ) {
            throw new Error( 'No such action' );
        }
        return tmp;
    } );
    return names;
}



//pipable operator: https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md
export const payloadOf = ( ...actions: Function[] ) => ( source: Observable<ActionWithPayload> ) => {
    const actionNames: string[] = toActionName( actions );
    return source.pipe( 
        filter( target => ( actionNames.find( action => action === target.type ) !== undefined ) ),
        map( target => target.payload )
    );
}



// help defining reducer
export class ReducerFactory<T> {
    private reducers: { [ action: string ]: Reducer<T> } = {};
    
    add( actions: Function | Function[], reducer: Reducer<T> ) {
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
    
    create( initialState: T ): ActionReducer<T> {
        const reducers = { ...this.reducers };  // copy
        return ( state: T = initialState, action: ActionWithPayload ) => {
            const reducer = reducers[ action.type ];
            let ret = state;
            
            if( reducer !== undefined ) {
                ret = reducer( state, action.payload );                
            }
            
            return ret;
        }
    }
}

