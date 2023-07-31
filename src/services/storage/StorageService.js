const fs = require('fs')

class StorageService {
  constructor(folder){
    this._folder = folder

    if(!fs.existsSync(folder)){
      fs.mkdir(folder, {recursive: true})
    }
  }

  writeFile(file, meta){
    const filename = +new Date() + meta.filename
    const path = `${this._folder}/${filename}`

    const fileStream = fs.createWriteStream(path)

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => error(reject)),
      file.pipe(fileStream)
      file.on('end', () => resolve(filename))
    })
  }

  deleteFile(filename){
    const path = `${this._folder}/${filename}`
    return fs.promises.unlink(path)
  }
}

module.exports = StorageService