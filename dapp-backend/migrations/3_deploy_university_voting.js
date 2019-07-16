var VotingToken = artifacts.require('./VotingToken.sol');
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = async (deployer) => {

  VotingTokenInstance = await VotingToken.deployed();

  await deployer.deploy(UniversityVoting, VotingToken.address );

  await VotingTokenInstance.addMinter(UniversityVoting.address);

};
