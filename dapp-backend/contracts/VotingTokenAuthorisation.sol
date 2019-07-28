pragma solidity ^0.5.3;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./VotingToken.sol";
import "./Institution.sol";
import "./ApprovalQueue.sol";


// *****TODO Complete Ownable flow for this contract*****

/**
 * The authorisation of Voting Tokens is implemented as a custom crowdsale - however the concept of purchasing tokens for Ether
 * is not utilised here. In simple terms, that boils down to buyTokens() not being called in the flow of an Institution admin
 * authorising a voter; rather,_deliverTokens() is called, and a token will then be minted and then transferred to the user.
 * Open Zeppelin crowdsale contracts are being inherited to provide automatic protection against reentrancy attacks and to
 * provide common crowdsale functionality without having to reinvent the wheel.
 */
 // TODO check ownable is still relevant
contract VotingTokenAuthorisation is MintedCrowdsale {


    Institution _institution;
    VotingToken _theToken;


    constructor (Institution institution, address admin, VotingToken votingToken)
    Crowdsale(1,  address(uint160(admin)), votingToken)
    public { //isAdmin(admin) { // CAN'T DO THIS BECAUSE _INSTITUTION NOT INITIALISED YET
        _institution = institution;
    }

    function sendVotingToken(address voter, uint256 tokenAmount, address admin) public isAdmin(admin) {
        super._deliverTokens(voter, tokenAmount);
    }

    modifier isAdmin(address admin)  {
        require(_institution.isAdminStored(admin), "VotingTokenAuthorisation: Caller is not an admin!");
        require(_institution.isAdminAuthorised(admin), "VotingTokenAuthorisation: Caller is an admin but not authorised!");
        _;
    }

}