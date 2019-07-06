const HDWalletProvider = require("truffle-hdwallet-provider");

const privateKey = "5D0A44B2F735738D8D121CF8866D45A516582C5DCFACD05E79F431FD3BBE1B98";

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
        return new HDWalletProvider(privateKey, "https://rinkeby.infura.io/v3/82bc3d3749d049248ee3333c6efabc25");
      },
      network_id: '4',
    },
  },

  

  compilers: {
    solc: {
      version: "0.5.2" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  },

  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
