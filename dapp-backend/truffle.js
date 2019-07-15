const dotenv = require("dotenv");
const HDWalletProvider = require("truffle-hdwallet-provider");

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
        return new HDWalletProvider(process.env.DAPP_PRIVATE_KEY, "https://rinkeby.infura.io/v3/82bc3d3749d049248ee3333c6efabc25");
      },
      network_id: '4',
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
