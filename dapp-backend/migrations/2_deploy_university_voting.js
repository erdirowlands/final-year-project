var VotingToken = artifacts.require('./VotingToken.sol');
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = async (deployer) => {

  await deployer.deploy(VotingToken);

  VotingTokenInstance = await VotingToken.deployed();

  await VotingTokenInstance.addMinter(UniversityVoting);


  await deployer.deploy(UniversityVoting, VotingToken.address );


};
