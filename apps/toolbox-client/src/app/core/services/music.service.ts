import { computed, inject, Injectable, Signal } from '@angular/core';
import { LocalStorageVars } from '@constants';
import { IScale } from '@libs/common';
import { LocalStorageService } from './local-storage.service';



@Injectable({
  providedIn: 'root',
})
export class MusicService {
  
  readonly localStorageService = inject(LocalStorageService);
  
  readonly scalesInStorageSignal: Signal<IScale[]> = computed(() => {
    return this.localStorageService.getStorageSignal()()[LocalStorageVars.musicScales] || [];
  });

  saveScaleInStorage(scale: IScale) {
    let scalesInStorage = this.scalesInStorageSignal().filter(x => x._id !== scale._id);
    scalesInStorage =  [...scalesInStorage, scale];
    this.localStorageService.set(LocalStorageVars.musicScales, scalesInStorage);
  }

  removeScaleFromStorage(scaleId: string) {
    let scalesInStorage = this.scalesInStorageSignal();
    scalesInStorage =  scalesInStorage.filter(x => x._id !== scaleId)
    this.localStorageService.set(LocalStorageVars.musicScales, scalesInStorage);
  }

}