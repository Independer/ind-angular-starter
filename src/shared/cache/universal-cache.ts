import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class CacheService {
    static KEY = 'CacheService';
    _cache = new Map();

    /**
     * check if there is a value in our store
     */
    has(key: string | number): boolean {
        let _key = this.normalizeKey(key);
        return this._cache.has(_key);
    }

    /**
     * store our state
     */
    // tslint:disable-next-line:no-any
    set(key: string | number, value: any): void {
        let _key = this.normalizeKey(key);
        this._cache.set(_key, value);
    }

    /**
     * get our cached value
     */
    // tslint:disable-next-line:no-any
    get(key: string | number): any {
        let _key = this.normalizeKey(key);
        return this._cache.get(_key);
    }

    /**
     * remove specific cache item
     */
    remove(key: string | number): boolean {
        let _key = this.normalizeKey(key);
        if (_key && this._cache.has(_key)) { 
            this._cache.delete(_key);
            return true;
        }
        return false;
    }

    /**
     * release memory refs
     */
    clear(): void {
        this._cache.clear();
    }

    /**
     * convert to json for the client
     */
    // tslint:disable-next-line:no-any
    dehydrate(): any {
        let json = {};
        // tslint:disable-next-line:no-any
        this._cache.forEach((value: any, key: string) => (<any>json)[key] = value);
        return json;
    }

    /**
     * convert server json into out initial state
     */
    // tslint:disable-next-line:no-any
    rehydrate(json: any): void {
        Object.keys(json).forEach((key: string) => {
            let _key = this.normalizeKey(key);
            let value = json[_key];
            this._cache.set(_key, value);
        });
    }

    /**
     * allow JSON.stringify to work
     */
    // tslint:disable-next-line:no-any
    toJSON(): any {
        return this.dehydrate();
    }

    /**
     * convert numbers into strings
     */
    normalizeKey(key: string | number): string {
        if (isDevMode() && this._isInvalidValue(key)) {
            throw new Error('Please provide a valid key to save in the CacheService');
        }

        return key + '';
    }

    // tslint:disable-next-line:no-any
    _isInvalidValue(key: any): boolean {
        return !key || typeof key === 'boolean' || Number.isNaN(<number>key);
    }
}
