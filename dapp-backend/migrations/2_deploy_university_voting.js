var Web3 = require("../node_modules/web3/");
web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.71:7545"));


var VotingToken = artifacts.require('./VotingToken.sol'); 
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = async (deployer) => {

  // Todo this will by my main rinkeby account - put as process.env for code document, even if i cant get it working
  await deployer.deploy(UniversityVoting, {from: "0x5465340976b69551613Aa544D8beD5DdF7343A62", value: 1000000000000000000});

 // const account = await web3.eth.accounts[0];
 //await web3.eth.sendTransaction( {from: "0x5465340976b69551613Aa544D8beD5DdF7343A62", to: UniversityVoting.address, value: 1000000000000000000});

 // UniversityVotingInstance = await UniversityVoting.deployed();

//  await deployer.deploy(VotingToken, UniversityVotingInstance.address);
 // VotingToken.address


};
