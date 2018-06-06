import dragDrop from 'drag-drop'
import { xx, isMobile } from 'xx'

// thanks!
// https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string#comment-75241120

function Uint8ToBase64(u8Arr) {
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0
  var length = u8Arr.length
  var result = ''
  var slice
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length))
    result += String.fromCharCode.apply(null, slice)
    index += CHUNK_SIZE
  }
  return btoa(result)
}

class FileHandler {
  constructor(painter) {
    this.isMobile = isMobile()
    this.painter = painter
    this.reader = new FileReader()
    this.observe()
    if (!this.isMobile) this.initDragDrop()
  }

  observe() {
    document.getElementById('file').addEventListener('change', this.onInputChange.bind(this))
    this.reader.addEventListener('load', this.onLoad.bind(this))
    this.reader.addEventListener('error', this.onError.bind(this))
  }

  onLoad(e) {
    const arr = new Uint8Array(e.target.result)
    const b64encoded = Uint8ToBase64(arr)
    const datajpg = `data:image/jpg;base64,${b64encoded}`
    this.painter.imageParser.load(datajpg)
  }

  onError(err) {
    console.error('FileReader error' + err)
  }

  onInputChange(e) {
    this.readFile(e.target.files[0])
  }

  readFile(file) {
    this.reader.readAsArrayBuffer(file)
  }

  initDragDrop() {
    dragDrop('#fileDropArea', {
      onDrop: (files, pos, fileList, directories) => this.readFile(files[0]),
      onDragEnter: () => document.body.classList.add('drag-file'),
      onDragOver: () => { xx('onDragOver') },
      onDragLeave: () => document.body.classList.remove('drag-file')
    })
  }
}


export default FileHandler
