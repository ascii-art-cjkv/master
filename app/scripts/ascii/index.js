import AsciiPainter from './AsciiPainter'
import * as dat from 'dat.gui'
import xx from 'xx'

const presets = {
  bopomofo: () => {
    return {
      resolution: 30,
      text: '中文字的順序會影響閱讀。ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐ',
      webcam: false,
    }
  },
  sign: () => {
    return {
      resolution: 3.048264182895851,
      text: '↓↑←→★△◯☆♞☞❖✵☻♕⚑',
      webcam: false,
    }
  }
}

const settings = presets.bopomofo()
const painter = new AsciiPainter(settings)

const handlers = {
  changeResolution: () => painter.setResolution(settings.resolution),
  changeText: () => painter.charParser.parse(settings.text),
  changeWebcam: () => painter.setSource(settings.webcam),
}

const gui = new dat.GUI()

// const gui = new dat.GUI({
//   load: {
//     remembered: {
//       '中文': [presets.bopomofo()],
//     　'★': [presets.sign()],
//     },
//     closed: false,
//     folders: {}
//   },
// })

// gui.remember(settings)

gui.add(settings, 'resolution', 2, 100).onChange(handlers.changeResolution).listen().step(1)
gui.add(settings, 'text').onFinishChange(handlers.changeText)
gui.add(settings, 'webcam').onFinishChange(handlers.changeWebcam)

import dragDrop from 'drag-drop'

// thanks! https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string#comment-75241120
function Uint8ToBase64(u8Arr) {
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

dragDrop('#ascii', {
  onDrop: (files, pos, fileList, directories) => {
    const file = files[0]
    const reader = new FileReader()

    reader.addEventListener('load', (e) => {
      const arr = new Uint8Array(e.target.result)
      const b64encoded = Uint8ToBase64(arr);
      const datajpg = `data:image/jpg;base64,${b64encoded}`
      painter.imageParser.load(datajpg)
    })

    reader.addEventListener('error', (err) => {
      console.error('FileReader error' + err)
    })

    reader.readAsArrayBuffer(file)
  },
  onDragEnter: () => { },
  onDragOver: () => { },
  onDragLeave: () => { }
})

