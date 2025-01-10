import { Note, ScalesIds } from "@constants";


export interface IScale {
  _id: string,
  startFret : number,
  endFret: number,
  note : Note | undefined,
  scale : ScalesIds | undefined,
  isBass :boolean
}

export interface IScaleSuggestion {
  note: Note,
  scale: ScalesIds
}