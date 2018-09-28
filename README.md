<h1 align="center">
  <img alt="Dapploy" src="http://xyo.network.s3.amazonaws.com/img/dapploy-logo.jpg" width="300">
</h1>
<h3 align="center">
  "Simplify Dapp Deployment"
</h3>

<p align="center">
  <a href="https://circleci.com/gh/XYOracleNetwork/tool-dappdeployer-nodejs">
    <img alt="Circle Status" src="https://circleci.com/gh/XYOracleNetwork/tool-dapploy-nodejs.svg?style=shield&circle-token=17875bb2726cc569f5426d27748d6386f2401f5b">
  </a>
  <a href="https://gitter.im/XYOracleNetwork/Dev">
    <img alt="Gitter Chat" src="https://img.shields.io/gitter/room/XYOracleNetwork/Stardust.svg">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img alt="Commitizen friendly" src="https://img.shields.io/badge/web3-friendly-brightgreen.svg">
    </a>
    <a href="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs" title="dependencies status"><img src="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs/status.svg"/></a>
  <a href="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs?type=dev" title="devDependencies status"><img src="https://david-dm.org/xyoraclenetwork/tool-dapploy-nodejs/dev-status.svg"/></a>
  <a href="https://bettercodehub.com/results/XYOracleNetwork/tool-dapploy-nodejs" title="Better Code"><img src="https://bettercodehub.com/edge/badge/XYOracleNetwork/tool-dapploy-nodejs?branch=master"/></a>
</p>

<p align="center">
  Made with ❤️
  <br/>by [XYO](https://xyo.network)
</p>

---

Finally, you can deploy dApps in less than 5 seconds flat WITHOUT even lifting a finger... Guaranteed!

OK, you may have to lift a finger.

But here's the deal.

We've gone through the hoops of deploying dApps on the Ethereum Network and have nuked out all of the annoying parts to make dapployment a breeze.

# Pt. I. Let's Get Crack-a-Lackin'

1. We use [Truffle](https://truffleframework.com) to deploy our smart contracts to any Ethereum blockchain.

**NOTE:** When you run the Dapp Deployer, your truffle project will need to be configured seperately. A good example you can use is in the provided sample Truffle project `samples/sample-datavault-solidity` and open `truffle.js` config file.

2. Remember to 'YARN ALL THE THINGS' from the main project dir. Run this command:

```
yarn && cd samples/sample-datavault-react/ && yarn && cd ../sample-datavault-solidity && yarn && cd ../..
```

3. Run `dapploy -h` to see the options:

```
Usage: dapploy [options] [command]

Options:

  -V, --version                                 output the version number
  -t, --projectDir <dir>                        Truffle Project Directory
  -n, --network [network]                       Deploy to network (default: development)
  -c, --config <config>                         Config file (default: .dapploy)
  -o, --contractOutput <dir>                    Contract Output Directory
  -x, --excludeContracts [Contract1,Contract2]  Exclude contracts from the web3 interface (files are still copied)
  -a, --includeContracts [Contract1,Contract2]  Include contracts from the web3 interface (files are still copied)
  -l, --clean                                   Clean contracts before migrating
  -r, --remoteOnly                              Only copy contracts remote
  -p, --pinToIpfs                               Pin contracts to IPFS for remote access
  -k, --bucketName                              Do remote copy of ABI to aws bucket (make sure to setup ~/.aws)
  -y, --copyOnly                                Only do folder copy and S3 copy
  -i, --init                                    Add default config file to current directory
  -h, --help                                    output usage information

Commands:

  init [options] [dir]                          Configure a new truffle project from scratch
  dapper [options]                              View your smart contracts using dapper

```

4. Add dapploy alias to run from any project in your bash_profile:
```
echo "alias dapploy=\"/<path_to_project>/tool-dapploy-nodejs/dapploy\""| cat >> .bash_profile
```

# Pt II. This Time, It's Personal

### Feature #1: `dapploy init` - create a new smart contract project!

1. Create a new project using dapploy:
```
dapploy init my-first-coin
cd my-first-coin
```

2. Make sure Ganache is downloaded, installed and open: [Download and install Ganache from their site](https://truffleframework.com/ganache)
- Click the Gear Icon thingy ( ⚙️ ) to open `Preferences...`
  Make sure that port is set to 8545. 

3. Dapploy from root directory 
- if you have alias setup for dapploy, just run
```
  dapploy
```

- otherwise run
```
  </path/to/dapploy/project>/dapploy
```

Congrats, you just built your first ERC-20 Token, FungibleToken! Head on over to [Dapper](https://github.com/XYOracleNetwork/tool-dapper-react) to play with it in a web-ui


4. Checkout some dapploy samples to get another Dapp built with dapploy that uses IPFS and Dapploy's web3 adaptor.
```
cd samples/sample-datavault-react && yarn start
```

# Want to make your ABI public? dapploy to IPFS!
```
dapploy -p

 $ Contracts stored to IPFS QmZ2Ezv4nsQ5tqGoHz4pUxa9GW88TWKMSzdxdMfxsHerWT
 $ View contracts at https://ipfs.xyo.network/ipfs/QmZ2Ezv4nsQ5tqGoHz4pUxa9GW88TWKMSzdxdMfxsHerWT
```

# Are you Dapploying to public testnet, or mainnet?

1. [Sign up for Infura](https://infura.io/)

2. [Install MetaMask from their site](https://metamask.io/)
- Sign into Metamask and change Network on Metamask to kovan/ropsten/mainnet

3.  Add your metamask wallet and infura data to `env.template` file:
```
WALLET=// wallet used to deploy contracts
INFURA_API_KEY=// API key you get from infura
MNENOMIC=// 12 word pass key from derived from your wallet private key
```

4.  Move `env.template` to `.env` (this file is already in your .gitignore)
```
mv env.template .env
```

5.  Using kovan, run
```
dapploy -n kovan
```
Ropsten:
```
dapploy -n ropsten
```

*NOTE* You don't need to specify `-n network` if you change `.dapploy` configuration file in your project from `network=development` to `network=kovan` etc.
```
vi .dapploy
```

If you are feeling adventurous run a local testnet node:

### [Ropsten testnet node setup (Geth)](https://github.com/XYOracleNetwork/tool-dapploy-nodejs/wiki/Local-Ropsten-Config)

### [Kovan testnet node setup (Parity)](<https://github.com/XYOracleNetwork/tool-dapploy-nodejs/wiki/Kovan-setup-(Parity)>)


# Want your dApp to support multiple browsers? 
1.  Setup account with [portis.io](https://portis.io) 

2.  Add Portis and Infura key to .dapploy
```
vi .dapploy
```
Uncomment:
```
# [Portis]
# portisApiKey=<API_KEY>
# infuraApiKey=<INFURA_API_KEY>
```

# Want to use S3 to host your ABI? 
1.  Confugure your AWS credentials in terminal by creating credentials file. [S3 credential instructions here](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html):
```
  vi ~/.aws/credentials
  [default]
  aws_access_key_id = AKIAIFYQ4UEUUJ6GDH6A
  aws_secret_access_key = FAKEasdfas=aqewrasdfa/sdfasdfasdfasdfFAKE
```

2. Configure dapploy
```
vi .dapploy
```
Uncomment:
```
#[AWS]
#bucketName=layerone.smart-contracts
#remotePath=ABI
```



## Street Cred

Made with ❤️
by [XYO](https://xyo.network)
