
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes the service available throughout the app
})
export class LocalStorageService {
  // Signal to track the state of local storage
  private storageSignal: WritableSignal<Record<string, any>>;

  // Flag to check if `localStorage` is available
  private isBrowser: boolean;

  constructor() {
    // Check if the code is running in the browser
    this.isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

    // Initialize the signal with current local storage data if in the browser
    this.storageSignal = signal(this.isBrowser ? this.loadAll() : {});
  }

  /**
   * Loads all key-value pairs from local storage into an object.
   * Only works in the browser.
   */
  private loadAll(): Record<string, any> {
    const data: Record<string, any> = {};
    if (!this.isBrowser) return data; // Return empty if not in browser

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch (e) {
          console.warn(`Error parsing key "${key}" from local storage:`, e);
        }
      }
    }
    return data;
  }

  /**
   * Returns the signal representing the state of local storage.
   * This allows components to react to changes in real-time.
   */
  getStorageSignal(): WritableSignal<Record<string, any>> {
    return this.storageSignal;
  }

  /**
   * Retrieves a specific value from local storage.
   * @param key The key of the item to retrieve.
   */
  get<T>(key: string): T | null {
    if (!this.isBrowser) return null; // Return null if not in browser
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  /**
   * Adds or updates a key-value pair in local storage.
   * @param key The key to set.
   * @param value The value to store, which will be serialized as JSON.
   */
  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return; // Do nothing if not in browser
    localStorage.setItem(key, JSON.stringify(value));
    this.updateSignal();
  }

  /**
   * Removes a specific key from local storage.
   * @param key The key to remove.
   */
  remove(key: string): void {
    if (!this.isBrowser) return; // Do nothing if not in browser
    localStorage.removeItem(key);
    this.updateSignal();
  }

  /**
   * Clears all data from local storage.
   */
  clear(): void {
    if (!this.isBrowser) return; // Do nothing if not in browser
    localStorage.clear();
    this.updateSignal();
  }

  /**
   * Updates the signal with the latest state of local storage.
   * This ensures that components using the signal are notified of changes.
   */
  private updateSignal(): void {
    if (!this.isBrowser) return; // Do nothing if not in browser
    this.storageSignal.set(this.loadAll());
  }
}
