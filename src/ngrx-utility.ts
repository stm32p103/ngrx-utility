// to store action name...not so good way.
const DICTIONARY = new Map<any,string>();

export interface ActionWithPayload {
    type: string;
    payload: any;
}

//local types
type Reducer<T> = ( state: T, payload?: any ) => T;
type ActionReducer<T> = ( state: T, action: ActionWithPayload ) => T;

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
function actionName( ...actions: any[] ) {
    let names = actions.map( action => DICTIONARY.get( action ) );
    return names;
}

// help defining reducer
export class ReducerFactory<T> {
    private reducers: { [ action: string ]: Reducer<T> } = {};
    
    add( actions: Function | Function[], reducer: Reducer<T> ) {
        let actionNames = actionName( actions );
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
