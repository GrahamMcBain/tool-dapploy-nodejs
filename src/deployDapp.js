
const { uploadRemote } = require('./awsFolderUploader')
const { parseConfig } = require('./configParser')
const { migrateTruffle } = require('./truffleMigrator')
const { execPromise } = require('./execWrapper')
const { exportConfig } = require('./web3ConfigExporter')
const path = require("path"); // from node.js

/* Copies the contracts in the specified project to a local project (react client, etc)

*/
let copyContractsLocal = (program) => {
    console.log(` $ Copying contracts locally to ${program.contractOutput}`);
    let fromPath = path.join(program.projectDir, "build/contracts/*")
    let cp = `cp -p ${fromPath} ${program.contractOutput}`
    return execPromise(cp)
}

let cleanIfNeeded = program => {
    if (program.clean) {
        let clean = 'rm -rf build'
        console.log(` $ Cleaning build folder at ${program.projectDir}`);
        return execPromise(clean, { cwd: program.projectDir })
    } else {
        console.log(` $ Skipping cleaning (use -clean for clean migration)`);
        return Promise.resolve()
    }
}

let createWeb3Module = (program, contracts) => {
    if (program.web3ModuleOutput) {
        console.log(` $ Exporting Web3 module to ${program.web3ModuleOutput}`);
        exportConfig(program, contracts)
    }
}

let dapploy = (program) => {
    console.log("Running dapploy")

    try {
        parseConfig(program)
    } catch (err) {
        return Promise.reject(err)
    }
    
    if (program.remoteOnly) {
        return uploadRemote(program)
    }
    
    return cleanIfNeeded(program).then(() => {
        if (program.copyOnly) {
            console.log(" # Skipping Migration")
            return Promise.resolve(undefined)
        } 
        return migrateTruffle(program)
    }).then((contracts) => {
        if (contracts) {
            createWeb3Module(program, contracts)
        }
        return copyContractsLocal(program)
    }).then(() => {
        if (program.skipAWS) {
            return Promise.resolve(undefined)
        } 
        return uploadRemote(program)
    })
}

module.exports = { dapploy }