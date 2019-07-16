var VotingToken = artifacts.require('./VotingToken.sol');
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = async (deployer) => {

    UniversityVotingInstance = await UniversityVoting.deployed();

    await deployer.deploy(VotingToken, UniversityVoting.address);

};