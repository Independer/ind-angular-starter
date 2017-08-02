import { Injectable } from '@angular/core';

@Injectable()
export class SsrState {
  private _map = new Map<string, any>();

  initialize(initialState: any) {
    Object.keys(initialState).forEach(key => {
      this.set(key, initialState[key]);
    });
  }

  keys() {
    return this._map.keys();
  }

  get(key: string): any {
    const cachedValue = this._map.get(key);
    this._map.delete(key);
    return cachedValue;
  }

  set(key: string, value: any): Map<string, any> {
    return this._map.set(key, value);
  }

  toJson(): any {
    const obj: { [key: string]: any } = {};

    Array.from(this.keys())
      .forEach(key => {
        obj[key] = this.get(key);
      });
    return obj;
  }
}
