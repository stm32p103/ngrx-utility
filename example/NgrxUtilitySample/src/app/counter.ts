import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReducerFactory, ToAction } from '../../../../dist';

export class CounterActions {
    static increment = ToAction( '[Counter] Increment', () => {} );
    static decrement = ToAction( '[Counter] Decrement', () => {} );
    static preset    = ToAction( '[Counter] Preset',    ( n: number ) => n );
}

const factory = new ReducerFactory<number>();

factory.add( CounterActions.increment, ( count ) => count + 1 );
factory.add( CounterActions.decrement, ( count ) => count - 1 );
factory.add( CounterActions.preset,    ( count, preset ) => preset );

export const counterReducer = factory.create( 0 );
