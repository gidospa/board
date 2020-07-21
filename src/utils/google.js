export default function google(){}
google.fileId = {}
google.getFileId = async function(filename) {
  let id = null
  let query = `name = '${filename}' and mimeType = 'application/json' and 'root' in parents and trashed = false`

  console.log('get file list')
  let res = await window.gapi.client.drive.files.list({q: query})

  for (let v of res.result.files) {
    if (v.name == filename) {
      id = v.id
      break
    }
  }
  return Promise.resolve(id)
}
google.download = async function(filename) {
  let fileId = this.fileId[filename]

  if (!fileId) {
    fileId = await this.getFileId(filename)
    if (fileId == null) {
      return null
    }
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
    if (fileId == null) {
      fileId = await this.create(filename)
    }
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
google.create = async function(filename) {
  let res = await window.gapi.client.drive.files.create({
    name: filename,
    description: 'field list for board app'
  })
  return res.result.id
}
google.delete = async function(filename) {
  let fileId = this.fileId[filename]
  if (!fileId) {
    fileId = await this.getFileId(filename)
    if (!fileId) return
  }
  let res = await window.gapi.client.drive.files.delete({
    fileId: fileId
  })
  delete this.fileId[filename]
  return res
}