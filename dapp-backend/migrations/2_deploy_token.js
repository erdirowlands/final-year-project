var VotingToken = artifacts.require('./VotingToken.sol');

module.exports = async (deployer) => {

  
  await deployer.deploy(VotingToken);
  
  };