import { ScalesIds, ScaleTypes } from "@constants";
import { IScaleSuggestion } from "@libs/common";

export const scales = [
  {
    'id': ScalesIds.MINORTHIRD,
    'name' : 'minor third',
    type : ScaleTypes.SIMPLE,
    'intervals' : [3]
  }, {
    'id': ScalesIds.MAJORTHIRD,
    'name' : 'major third',
    type : ScaleTypes.SIMPLE,
    'intervals' : [4]
  },{
    'id': ScalesIds.MAJORSCALE,
    'name' : 'major',
    type : ScaleTypes.SCALE,
    'intervals' : [2, 2, 1, 2, 2, 2, 1]
  },{
    'id': ScalesIds.MAJORCHORD,
    'name' : 'major chord',
    type : ScaleTypes.ARPEGE,
    'intervals' : [4, 3]
  },
  {
    'id': ScalesIds.MAJORCHORD7,
    'name' : 'major 7',
    type : ScaleTypes.ARPEGE,
    'intervals' : [4, 3, 3]
  },
  {
    'id': ScalesIds.MAJORCHORDMAJ7,
    'name' : 'major maj7',
    type : ScaleTypes.ARPEGE,
    'intervals' : [4, 3, 4]
  },
  {
    'id': ScalesIds.MAJORPENTATONIC,
    'name' : 'pentatonique majeure',
     type : ScaleTypes.SCALE,
    'intervals' : [2, 2, 3, 2, 3]
  },
  {
    'id': ScalesIds.MINORSCALE,
    'name' : 'minor',
    type : ScaleTypes.SCALE,
    'intervals' : [2, 1, 2, 2, 1, 2, 2]
  },
//   {
//     'id': ScalesIds.MINORMELODICSCALE,
//     'name' : 'minor',
//     'intervals' : [2, 1, 2, 2, 1, 2, 2]
//   },
  {
    'id': ScalesIds.MINORHARMONICSCALE,
    'name' : 'minor harmonic',
    type : ScaleTypes.SCALE,
    'intervals' : [2, 1, 2, 2, 1, 3, 1]
  },
  {
    'id': ScalesIds.MINORCHORD,
    'name' : 'minor chord',
    type : ScaleTypes.ARPEGE,
    'intervals' : [3, 4]
  },
  {
    'id': ScalesIds.MINORCHORD7,
    'name' : 'minor 7',
    type : ScaleTypes.ARPEGE,
    'intervals' : [3, 4, 3]
  },
  {
    'id': ScalesIds.MINORCHORDMAJ7,
    'name' : 'minor maj7',
    type : ScaleTypes.ARPEGE,
    'intervals' : [3, 4, 4]
  },
  {
    'id': ScalesIds.MINORPENTATONIC,
    'name' : 'pentatonique mineure',
    type : ScaleTypes.SCALE,
    'intervals' : [3, 2, 2, 3, 2]
  },
  {
    'id': ScalesIds.DORIANMODE,
    'name' : 'dorien',
    type : ScaleTypes.MODE,
    'intervals' : [2, 1, 2, 2, 2, 1, 2]  
  },
  {
    'id': ScalesIds.PHRYGIANMODE,
    'name' : 'phrygien',
    type : ScaleTypes.MODE,
    'intervals' : [1, 2, 2, 2, 1, 2, 2]  
  },
  {
    'id': ScalesIds.PHRYGIANDOMINANTMODE,
    'name' : 'phrygien dominant',
    type : ScaleTypes.MODE,
    'intervals' : [1, 3, 1, 2, 1, 2, 2]  
  },
  {
    'id': ScalesIds.LYDIANMODE,
    'name' : 'lydien',
    type : ScaleTypes.MODE,
    'intervals' : [2, 2, 2, 1, 2, 2, 1]  
  },
  {
    'id': ScalesIds.MIXOLYDIANMODE,
    'name' : 'mixolydien',
    type : ScaleTypes.MODE,
    'intervals' : [2, 2, 1, 2, 2, 1, 2]  
  },
  {
    'id': ScalesIds.LOCRIANMODE,
    'name' : 'locrien',
    type : ScaleTypes.MODE,
    'intervals' : [1, 2, 2, 1, 2, 2, 2]  
  },
];

export const  guitarStrings= [
  {
    base : 'E',
    notes: ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
    bassString : false
  },
  {
    'base' : 'B',
    notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
    bassString : false
  },
  {
    'base' : 'G',
    notes: ['G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F'],
    bassString : true
  },
  {
    'base' : 'D',
    notes: ['D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    bassString : true
  },
  {
    'base' : 'A',
    notes: ['A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
    bassString : true
  },
  {
    'base' : 'E',
    notes: ['F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'],
    bassString : true
  }
];

export const scalesSuggestions : IScaleSuggestion[] = [{
  note: "A",
  scale: ScalesIds.MINORCHORD
},
{
  note: "G",
  scale: ScalesIds.MAJORCHORD
},
{
  note: "E",
  scale: ScalesIds.MAJORCHORD7
},
]