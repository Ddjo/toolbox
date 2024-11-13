import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
export class GlobalService { 

    mockResponses = new BehaviorSubject<boolean>(false);
}