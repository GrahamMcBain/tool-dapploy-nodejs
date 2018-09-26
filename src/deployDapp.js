const path = require(`path`) // from node.js
const { uploadRemote } = require(`./awsFolderUploader`)
const { migrateTruffle } = require(`./truffleMigrator`)
const { execPromise } = require(`./execWrapper`)
const { exportConfig } = require(`./web3ConfigExporter`)
const { uploadIPFS } = require(`./ipfsUploader`)
const tempContractsOutput = `/tmp/tempContractsOutputFolder`
/* Copies the contracts in the specified project to a local project (react client, etc)

*/
const copyContractsLocal = (program) => {
  if (!program.contractOutput) {
    console.log(
      ` $ Skipping local copy add contractOutput param if you want to copy the ABI locally`
    )
    return Promise.resolve()
  }
  const fromPath = path.join(program.projectDir, `build/contracts/*`)
  console.log(` $ Copying contracts locally to ${program.contractOutput}`)

  if (fromPath === program.contractOutput) {
    console.log(` $ From path is equal to path, ignoring copy`)
    // if contract output is equal to fromPath, just let it
    return Promise.resolve()
  }
  // Copy to temp folder before moving to destination in case src and dest are the same
  // Is there a cleaner way?
  // cp -rfpiU... all just throw errors when src == dest, and paths strings
  const cp = `mkdir -p ${tempContractsOutput} && 
  mkdir -p ${program.contractOutput} && \
  cp -p ${fromPath} ${tempContractsOutput} && \
  mv ${tempContractsOutput}/* ${program.contractOutput} && \
  rm -rf ${tempContractsOutput}`
  return execPromise(cp)
}

const cleanIfNeeded = (program) => {
  if (program.clean) {
    const clean = `rm -rf build`
    console.log(` $ Cleaning build folder at ${program.projectDir}`)
    return execPromise(clean, { cwd: program.projectDir })
  }
  console.log(` $ Skipping cleaning (use -clean for clean migration)`)

  return Promise.resolve()
}

const createWeb3Module = (program, contracts) => {
  if (program.web3ModuleOutput) {
    console.log(` $ Exporting Web3 module to ${program.web3ModuleOutput}`)
    exportConfig(program, contracts)
  }
}

const dapploy = (program) => {
  console.log(`Running dapploy`)

  if (program.remoteOnly) {
    return uploadRemote(program)
  }
  if (program.pinToIpfs) {
    return uploadIPFS(program)
  }

  return cleanIfNeeded(program)
    .then(() => {
      if (program.copyOnly) {
        console.log(` # Skipping Migration`)
        return Promise.resolve(undefined)
      }
      console.log(` # Migration called`)

      return migrateTruffle(program)
    })
    .then((contracts) => {
      if (contracts) {
        createWeb3Module(program, contracts)
      }
      return copyContractsLocal(program)
    })
    .then(() => {
      if (program.bucketName) {
        return uploadRemote(program)
      }
      console.log(` # Skipping AWS bucket upload`)
      return Promise.resolve(undefined)
    })
}

module.exports = { dapploy }
