module.exports = {
  networks: {
    ganacheCLI: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganacheGUI: {
      host: "192.168.1.71",
      port: 7545,
      network_id: "*" // Match any network id
    }
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