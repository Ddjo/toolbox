import { InjectionToken } from "@angular/core";

/**
 * necessary for generic effects, calling different API endpoints for each app
 */
export const API_BOOK_TOKEN = new InjectionToken('apiToken');
