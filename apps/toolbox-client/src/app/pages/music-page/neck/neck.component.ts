import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Note, notes, ScalesIds, ScaleTypes } from '@constants';
import { IScale } from '@libs/common';
import { SelectItemGroup } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { environment } from '../../../../environments/environments';
import { MusicService } from '../../../core/services/music.service';
import { guitarStrings, scales } from '../../../shared/music/data/scales';
import { CardModule } from 'primeng/card';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-neck',
  templateUrl: './neck.component.html',
  styleUrls: ['./neck.component.scss'],
  imports: [
    CommonModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
    FloatLabelModule,
    BadgeModule,
    FormsModule,
    CardModule,
    ReactiveFormsModule,
    OverlayBadgeModule
  ]
})
export class NeckComponent implements OnInit {

  musicService = inject(MusicService);

  scale = input.required<IScale>();
  removeScaleEvent = output<string>();

  baseStartFret =environment.music.baseStartFret;
  baseEndFret = environment.music.baseEndFret;

  scaleForm = new FormGroup({
    _id: new FormControl<string | undefined>(undefined),
    startFret : new FormControl<number>(this.baseStartFret),
    endFret : new FormControl<number>(this.baseEndFret),
    note : new FormControl<Note | undefined>(undefined),
    scale : new FormControl<ScalesIds | undefined>(undefined),
    isBass : new FormControl<boolean>(false)
  }) 

  notes = [...notes];
  fretList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 , 19];
  availableStartFrets: number[] = [];
  availableEndFrets: number[] = [];
  fretNumberToDisplay = [5, 7, 9, 12, 15, 17];
  filteredFretList = [...this.fretList];
  // scales = scales;
  groupedScales : SelectItemGroup[] = [];



  displayedStrings =  [...guitarStrings];
  isBass = false;

  notesToDisplay: string[] = [...notes];

  constructor() {
    this.scaleForm.valueChanges.subscribe(() => this.buildNecksFretsAndNotes());
    this.scaleForm.controls.isBass.valueChanges.subscribe(val => this.toggleBass(val as boolean))
  }

  ngOnInit(): void {
    this.scaleForm.patchValue(this.scale());
    this.buildNecksFretsAndNotes();
    this.groupScales();
  }

  groupScales() {
    this.groupedScales.push({
        label: 'Simple',
        value: ScaleTypes.SIMPLE,
        items: [
          ...scales.filter(scale => scale.type === ScaleTypes.SIMPLE).map(scale => { return {
            label : scale.name,
            value: scale
          } 
        })]
      },{
        label: 'Scale',
        value: ScaleTypes.SCALE,
        items: [
          ...scales.filter(scale => scale.type === ScaleTypes.SCALE).map(scale => { return {
            label : scale.name,
            value: scale
          } 
        })]
      },{
        label: 'Arpege',
        value: ScaleTypes.ARPEGE,
        items: [
          ...scales.filter(scale => scale.type === ScaleTypes.ARPEGE).map(scale => { return {
            label : scale.name,
            value: scale
          } 
        })]
      },{
        label: 'Mode',
        value: ScaleTypes.MODE,
        items: [
          ...scales.filter(scale => scale.type === ScaleTypes.MODE).map(scale => { return {
            label : scale.name,
            value: scale
          } 
        })]
      },
    
    )
  }

  buildNecksFretsAndNotes() {

    // Frets range
    this.filteredFretList = [];

    const startFret = this.scaleForm.getRawValue().startFret as number  === 0 ? 
      0 : this.scaleForm.getRawValue().startFret as number - 1;
    const endFret = this.scaleForm.getRawValue().endFret as number;

    this.availableStartFrets = this.fretList.slice(0, endFret);
    this.availableEndFrets = this.fretList.slice(startFret + 2, this.fretList.length);

    for (let i = startFret; i < endFret; i++) {
      this.filteredFretList.push(i);
    }

    // Filter notes depending on selected scale
    if (this.scaleForm.value.scale && this.scaleForm.value.note) {

      this.notesToDisplay =[];
      const note = this.scaleForm.value.note;
      const intervals =  scales.find(x => x.id === this.scaleForm.value.scale)?.intervals;

      // get the notes array starting by selected note
      const notesArrayStartingByNote = this.getOrderedNotesArrayFromNote(note);

      this.notesToDisplay.push(note);

      let intervalleCumul = 0;

      intervals?.forEach(interval => {
          intervalleCumul = intervalleCumul + interval;
          this.notesToDisplay.push(notesArrayStartingByNote[intervalleCumul]);
      })

    } else {
      this.notesToDisplay = [...notes];
    }
  }

  getOrderedNotesArrayFromNote(note : Note) {
    return notes.slice(notes.indexOf(note)).concat(notes.slice(0,notes.indexOf(note)));
  }

  isNoteThird(note: string) {
    // return this.currentScaleNotes && this.currentScaleNotes.length && this.selectedGamme ?
    // this.currentScaleNotes.indexOf(note) ===
    // this.gammes.find(x => x.id === this.selectedGamme)?.thirdNoteIndex : false;
  }

  saveScale() {
    this.scaleForm.markAsPristine();
    this.musicService.saveScaleInStorage(this.scaleForm.getRawValue() as IScale);
  }

  toggleBass(isBass: boolean) {
    if(!isBass) {
      this.displayedStrings =  [...guitarStrings];
    } else {
      this.displayedStrings =  [...guitarStrings.filter(guitarString => guitarString.bassString)];
    }
  }

}


