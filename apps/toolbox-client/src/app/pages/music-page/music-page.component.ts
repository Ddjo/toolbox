import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environments';
import { MusicService } from '../../core/services/music.service';
import { scalesSuggestions } from '../../shared/music/data/scales';
import { NeckComponent } from './neck/neck.component';
import { Note, ScalesIds, ScaleTypes } from '@constants';

@Component({
  selector: 'app-music-page',
  templateUrl: './music-page.component.html',
  styleUrls: ['./music-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ButtonModule,
    NeckComponent
  ]
})
export class MusicPageComponent  {

  readonly musicService = inject(MusicService);

  scalesSuggestions = scalesSuggestions;
  
  scales = computed(() => this.musicService.scalesInStorageSignal());



  addScale(note?: Note, scaleId?: ScalesIds) {
    this.musicService.saveScaleInStorage({
      _id: Date.now().toString(),
      startFret: environment.music.baseStartFret,
      endFret: environment.music.baseEndFret,
      note: note || undefined,
      scale: scaleId || undefined,
      isBass: false
    })
  }

  removeScale(id: string) {
    this.musicService.removeScaleFromStorage(id)
  }
}
