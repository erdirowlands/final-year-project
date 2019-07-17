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
contract VotingTokenAuthorisation is MintedCrowdsale, TimedCrowdsale, ApprovalQueue {

    string constant public voterApprovalRequestType = "voterApprovalRequest";

    Institution _institution;
    VotingToken theToken;

    // Enable the prevention of duplicate addresses caused by
    // unforseen, errant client requests.
    struct VoterRequestStruct {
        bool isPending;
        bool isAuthorised;
        bool isInitialised;
    }

    mapping(address => VoterRequestStruct) public _voterRequests;

    constructor (Institution institution, address admin, uint256 openingTime, uint256 closingTime, VotingToken votingToken)
    Crowdsale(1,  address(uint160(admin)), votingToken)
    TimedCrowdsale(openingTime, closingTime)
    public { //isAdmin(admin) { // CAN'T DO THIS BECAUSE _INSTITUTION NOT INITIALISED YET
        _institution = institution;
    }

    function approveVoterRequest(address submittingAddress) public isAdmin(msg.sender){
        super.approveRequest(submittingAddress);

        // New Institution created sucessfully so set the request to not pending.
        _approvalRequestQueue[submittingAddress].isPending = false;
        // Emit the succesfull approval of the new admin.
    }

    function submitVoterApprovalRequest(bytes32[] memory requestData) public {
       // institutionName adminFirstName adminSurname adminAddress
        super.submitApprovalRequest(voterApprovalRequestType, requestData);
    }

    function sendVotingToken(address voter, uint256 tokenAmount) public isAdmin(msg.sender) {
        super._deliverTokens(voter, tokenAmount);
    }

    modifier isAdmin(address admin)  {
        require(_institution.isAdminStored(admin), "Caller is not an admin!");
        require(_institution.isAdminAuthorised(admin), "Caller is an admin but not authorised!");
        _;
    }

}