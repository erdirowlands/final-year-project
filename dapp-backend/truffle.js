const dotenv = require("dotenv");
const HDWalletProvider = require("truffle-hdwallet-provider");

const web3 = require("Web3");

dotenv.config();

module.exports = {
  networks: {

    development: {
      host: "192.168.1.71",
      port: 7545,
      network_id: "*",
      accounts: 5,
      defaultEtherBalance: 500,
      blockTime: 3
    },

    ganacheGUI: {
      host: "192.168.1.71",
      port: 7545,
      network_id: "*" // Match any network id
    },

    ganacheCLI: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider("5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98", "https://rinkeby.infura.io/v3/f2c4ebd8ed604600a20a3236bffb51df");
      },
      gasPrice: 50000000000,
      network_id: '4',
    },

    kovan: {
      provider: function() {
        return new HDWalletProvider("5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98", "https://kovan.infura.io/v3/f2c4ebd8ed604600a20a3236bffb51df");
      },
      gasPrice: 20000000000,
      network_id: '42',
    },
  },



  

  compilers: {
    solc: {
      version: "0.5.3" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  },

  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
