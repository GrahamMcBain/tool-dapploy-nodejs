const abiFilePaths = require(`./fileReader`).abiFilePaths

const AWS = require(`aws-sdk`)
const path = require(`path`)
const fs = require(`fs`)

const uploadFiles = (bucketName, remotePath, awsS3Client, files) => {
  const promises = []
  // for each file in the directory
  files.forEach((filePath) => {
    const rPath = remotePath ? `${remotePath}/` : ``
    const fileName = `${rPath}${path.basename(filePath)}`
    // ignore if directory
    if (fs.lstatSync(filePath).isDirectory()) {
      return
    }
    promises.push(
      new Promise((resolve, reject) => {
        // read file contents
        fs.readFile(filePath, (error, fileContent) => {
          if (error) {
            reject(error)
          }
          console.log(`Saving`, bucketName, fileName)
          const params = {
            Bucket: bucketName,
            ACL: `bucket-owner-full-control`,
            Key: fileName,
            Body: fileContent,
            ContentType: `json`
          }
          // upload file to awsS3Client
          awsS3Client.putObject(params, (err, res) => {
            if (err) {
              return reject(err)
            }
            console.log(`Successfully uploaded '${fileName}'`)

            return resolve(res)
          })
        })
      })
    )
  })
  return Promise.all(promises)
}

const clearBucket = async (bucketName, remotePath, awsS3Client) => {
  const params = {
    Bucket: bucketName,
    Prefix: `${remotePath}`
  }
  const listedObjects = await awsS3Client.listObjectsV2(params).promise()
  const deleteParams = {
    Bucket: bucketName,
    Delete: { Objects: [] }
  }
  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key })
  })
  await awsS3Client.deleteObjects(deleteParams).promise()

  if (listedObjects.Contents.IsTruncated) await clearBucket(bucketName, remotePath)
}

const uploadRemote = async (program) => {
  const bucketName = program.bucketName
  return abiFilePaths(program).then(async (files) => {
    const rPath = program.remotePath ? `${program.remotePath}/` : ``

    const remotePath = `${rPath}${program.network}`
    console.log(` $ Copying contracts to remote AWS bucket ${bucketName}`)

    const awsS3Client = new AWS.S3({
      signatureVersion: `v4`
    })

    // const client = s3.createClient()
    await clearBucket(bucketName, remotePath, awsS3Client)
    return uploadFiles(bucketName, remotePath, awsS3Client, files)
  })
}

module.exports = { uploadRemote }
