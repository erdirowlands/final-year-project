var VotingToken = artifacts.require('./VotingToken.sol');
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = async (deployer) => {

    await deployer.deploy(VotingToken, UniversityVoting.address);

    UniversityVotingInstance = await UniversityVoting.deployed();

    await UniversityVotingInstance.setVotingTokenAddress(VotingToken.address);


};