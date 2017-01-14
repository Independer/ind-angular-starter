import { Injectable } from '@angular/core';

export type InternalStateType = {
  // tslint:disable-next-line:no-any
  [key: string]: any
};

@Injectable()
export class AppState {

  private stateField: InternalStateType = {};

  // already return a clone of the current state
  public get state() {
    return this.stateField = this._clone(this.stateField);
  }
  // never allow mutation
  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  // tslint:disable-next-line:no-any
  public get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  // tslint:disable-next-line:no-any
  public set(prop: string, value: any) {
    // internally mutate our state
    return this.stateField[prop] = value;
  }

  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }
}
