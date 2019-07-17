var VotingToken = artifacts.require('./VotingToken.sol');
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = async (deployer) => {

 // await deployer.deploy(VotingToken);

//  VotingTokenInstance = await VotingToken.deployed();
//  deployer.deploy(Migrations);
  await deployer.deploy(UniversityVoting);

 // UniversityVotingInstance = await UniversityVoting.deployed();

//  await deployer.deploy(VotingToken, UniversityVotingInstance.address);
 // VotingToken.address


};
