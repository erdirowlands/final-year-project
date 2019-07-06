var VotingToken = artifacts.require('./VotingToken.sol');
var UniversityVoting = artifacts.require('./UniversityVoting.sol');

module.exports = function(deployer) {

  // TODO Workout correct deployment script for all contracts.
  /*
  const _name = 'Voting Token';
  const _symbols = 'VTK';
  const _decimals = '18';

  deployer.deploy(VotingToken, _name, _symbols, _decimals); */

  deployer.deploy(UniversityVoting);

};
