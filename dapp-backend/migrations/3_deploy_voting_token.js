var VotingToken = artifacts.require('./VotingToken.sol');
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = async (deployer) => {

    const name = "Voting Token";
    const symbol = "VTK";
    const decimals = 18;

    UniversityVotingInstance = await UniversityVoting.deployed();

    await deployer.deploy(VotingToken, UniversityVotingInstance.address, name, symbol, decimals);

    await UniversityVotingInstance.setVotingTokenAddress(VotingToken.address), {gas: 5000000};


};