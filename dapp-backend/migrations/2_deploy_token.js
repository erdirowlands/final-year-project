var VotingToken = artifacts.require('./VotingToken.sol');

module.exports = function(deployer) {

  
    deployer.deploy(VotingToken);
  
  };