

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
