import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ICache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: BehaviorSubject<any>;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private cache: ICache;

  constructor() {
    // Set defaults here, for example
    // Get initial state of cookies from previously set values. If nothing is found, set defaults
    // const cookies = localStorage.getItem(LocalStorageVars.cookiesAccepted);
    // const acceptedCookies = cookies !== null ? JSON.parse(cookies) : CookieStatus.undefined;

    // set the initial state in the cache
    this.cache = {
    };

  }

  get isLocalStorageSupported(): boolean {
    try {
      return !!localStorage;
    } catch(err) {
      return false;
    }
  }

  // Methods
  /**
   * Save a given object to local storage.
   * @example this.localStorageService.setItem<IAuthUser>(LocalStorageVars.authUser, user);
   * @param key name that the object should be saved under
   * @param value the object
   * @returns behavior subject that you can subscribe to and listen for changes
   */
  setItem<T>(key: string, value: T): BehaviorSubject<T> {
    if (this.isLocalStorageSupported) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    if (this.cache[key]) {
      this.cache[key].next(value);
      return this.cache[key] as BehaviorSubject<T>;
    }

    return (this.cache[key] = new BehaviorSubject(value));
  }

  /**
   * Get a specific object from local storage cache
   * @example this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser).getValue();
   * @example const authUser$ = this.localStorageService.getItem<IAuthUser>(LocalStorageVars.authUser).getValue(); authUser$.subscribe();
   * @param key name of the object
   * @returns behavior subject that you can subscribe to and listen for changes
   */
  getItem<T>(key: string): BehaviorSubject<T | null> | null {
    if (this.cache[key]) {
      return this.cache[key] as BehaviorSubject<T | null>;
    }

    if (this.isLocalStorageSupported) {
      const item = localStorage.getItem(key);
      if (item !== null) {

        try {
          const value = JSON.parse(item);
          return (this.cache[key] = new BehaviorSubject<T | null>(value));
        } catch (e) {
          return new BehaviorSubject<T | null>(null);
        }

      } else {
        return new BehaviorSubject<T | null>(null);
      }
    }
    return null;
  }

  /**
   * Remove a specific object from local storage
   * @example this.localStorageService.removeItem(LocalStorageVars.authUser);
   * @param key name of the object
   */
  removeItem(key: string): void {
    if (this.isLocalStorageSupported) {
      localStorage.removeItem(key);
    }
    if (this.cache[key]) this.cache[key].next(undefined);
  }
}
