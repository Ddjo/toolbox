
export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Note = typeof notes[number]; // 'C' | 'C#' | 'D' | 'D#' | 'E' | ...
export enum NoteIndex {
  C = 0,
  CSharp = 1,
  D = 2,
  DSharp = 3,
  E = 4,
  F = 5,
  FSharp = 6,
  G = 7,
  GSharp = 8,
  A = 9,
  ASharp = 10,
  B = 11,
}

export enum ScalesIds {
    MAJORTHIRD = 'major-thirds',
    MAJORSCALE = 'major-scale',
    MAJORCHORD = 'major-chord',
    MAJORCHORD7 = 'major-chord-7',
    MAJORCHORDMAJ7 = 'major-chord-maj-7',
    MAJORPENTATONIC = 'major-pentatonic',
    MINORTHIRD = 'minor-thirds',
    MINORSCALE = 'minor-scale',
    MINORMELODICSCALE = 'minor-melodic-scale',
    MINORHARMONICSCALE = 'minor-harmonic-scale',
    MINORCHORD = 'minor-chord',
    MINORCHORD7 = 'minor-chord-7',
    MINORCHORDMAJ7 = 'minor-chord-maj-7',
    MINORPENTATONIC = 'minor-pentatonic',
    DORIANMODE = 'dorian-mode',
    PHRYGIANMODE = 'phrygian-mode',
    PHRYGIANDOMINANTMODE = 'phrygian-dominant-mode',
    LYDIANMODE = 'lydian-mode',
    MIXOLYDIANMODE = 'mixolydian-mode',
    LOCRIANMODE = 'locrian-mode',
  }

export enum ScaleTypes {
    SIMPLE = "simple",
    SCALE = "scale",
    ARPEGE = "arpege",
    MODE = "mode"
}
