export default function google(){}
google.fileId = {}
google.getFileId = async function(googleFieldFile) {
  let id = null
  let query = `name = '${googleFieldFile}' and mimeType = 'application/json' and 'root' in parents and trashed = false`

  console.log('get file list')
  let res = await window.gapi.client.drive.files.list({q: query})

  for (let v of res.result.files) {
    if (v.name == googleFieldFile) {
      id = v.id
      break
    }
  }
  if (id == null) {
    console.log('create new file')
    let res = await window.gapi.client.drive.files.create({
      name: googleFieldFile,
      description: 'field list for board app'
    })
    id = res.result.id
  }

  if (id == null) {
      return Promise.reject('cannot get google file id')
  }

  return Promise.resolve(id)
}
google.download = async function(filename) {
  let fileId = this.fileId[filename]
  if (!fileId) {
    fileId = await this.getFileId(filename)
    this.fileId[filename] = fileId  
  }
  let param = {
    fileId: fileId,
    alt: 'media'
  }
  let res = await window.gapi.client.drive.files.get(param)
  return res.body
}
google.upload = async function(filename, contents) {
  let fileId = this.fileId[filename]
  if (!fileId) {
    fileId = await this.getFileId(filename)
    this.fileId[filename] = fileId  
  }
  let path = `/upload/drive/v3/files/${fileId}`
  let method = 'PATCH'
  let params = {
      uploadType: 'media'
  }
  let headers = {}
  let body = contents

  await window.gapi.client.request({path, method, params, headers, body})
}