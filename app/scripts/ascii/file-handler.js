import dragDrop from 'drag-drop'
import xx from 'xx'

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

function initFileHandler(painter) {
  dragDrop('#fileDropArea', {
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
    onDragEnter: () => document.body.classList.add('drag-file'),
    onDragOver: () => { xx('onDragOver') },
    onDragLeave: () => document.body.classList.remove('drag-file')
  })
}

export default initFileHandler
