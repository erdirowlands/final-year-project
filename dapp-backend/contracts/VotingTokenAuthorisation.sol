pragma solidity ^0.5.3;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./VotingToken.sol";
import "./Institution.sol";

// *****TODO Complete Ownable flow for this contract*****

/**
 * The authorisation of Voting Tokens is implemented as a custom crowdsale - however the concept of purchasing tokens for Ether
 * is not utilised here. In simple terms, that boils down to buyTokens() not being called in the flow of an Institution admin
 * authorising a voter; rather,_deliverTokens() is called, and a token will then be minted and then transferred to the user.
 * Open Zeppelin crowdsale contracts are being inherited to provide automatic protection against reentrancy attacks and to
 * provide common crowdsale functionality without having to reinvent the wheel.
 */
contract VotingTokenAuthorisation is MintedCrowdsale, TimedCrowdsale, Ownable {

    Institution _institution;
    VotingToken theToken;

    constructor (address institution, address admin, uint256 openingTime, uint256 closingTime, VotingToken votingToken)
    Crowdsale(1,  address(uint160(admin)), votingToken)
    TimedCrowdsale(openingTime, closingTime)
    public { //isAdmin(admin) {
        _institution = Institution(institution);
    }

    modifier isAdmin(address admin)  {
        require(_institution.isAdminStored(admin), "Caller is not an admin!");
        require(_institution.isAdminAuthorised(admin), "Caller is an admin but not authorised!");

        _;
    }

    function sendVotingToken(address voter, uint256 tokenAmount) public isAdmin(msg.sender) {
        super._deliverTokens(voter, tokenAmount);
    }
}