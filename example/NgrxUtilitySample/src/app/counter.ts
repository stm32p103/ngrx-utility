import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReducerFactory, ToAction } from '../../../../dist';

export class CounterActions {
    @ToAction()
    static increment(): any {
        console.log( 'increment action' );
    }

    @ToAction()
    static decrement(): any {
        console.log( 'decrement action' );
    }
    
    @ToAction()
    static preset( n: number ): any {
        console.log( 'preset action' );
        return n;
    }
}

const factory = new ReducerFactory<number>();

factory.add( CounterActions.increment, ( count: number ) => {
    return count + 1;
} );

factory.add( CounterActions.decrement, ( count: number ) => {
    return count - 1;
} );

factory.add( CounterActions.preset, ( count: number, preset: number ) => {
    return preset;
} );

export const counterReducer = factory.create( 0 );
