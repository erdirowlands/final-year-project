pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./VotingToken.sol";
import "./Institution.sol";


/**
 * The authorisation of Voting Tokens is implemented as a crowdsale - however the concept of purchasing tokens for Ether
 * is not utilised here. In simple terms, that boils down to buyTokens() not being called in the flow of an Institution admin
 * authorising a voter; rather,_deliverTokens() is called, and a token will then be minted and then transferred to the user.
 * Open Zeppelin crowdale contracts are being inherited to provide automatic
 * protection against reentrancy attacks and to not reinvent the ubiqitous crowdsale-wheel.
 */
contract TokenAuthorisation is MintedCrowdsale, TimedCrowdsale {

    Institution _institution;
    VotingToken public _votingToken;

    constructor (address institution, uint256 openingTime, uint256 closingTime)
    TimedCrowdsale(openingTime, closingTime) public isAdmin(msg.sender) {
        _institution = Institution(institution);
    }

    modifier isAdmin(address admin)  {
        require(_institution.isAdminStored(admin), "Caller is not an admin!");
        _;
    }

    function sendVotingToken(address voter, uint256 tokenAmount) public isAdmin(msg.sender) {
        super._deliverTokens(voter, tokenAmount);
    }
}