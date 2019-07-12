pragma solidity ^0.5.2;

import "solidity-util/lib/Strings.sol";

/**
* Initially, each contract that required some sort of approval functionality, whether that was for approving voters, or new institution
* admins, contained their own unique approval queues. That approach proved to be in violation of the DRY principle, as the underlying requirements
* for approving a request were the same. Therefore, the concept was generalised into this utility contract, with the approval data required to be
* "split" around some basic regex - in this case, a comma.
*/
contract ApprovalQueue {

    using Strings for string;

    // Store a request from a prospective admin who would like to register their Institution.
    // The flag "isPending" is included to stop potential abuse of the approval que - the intent
    // is that only one approval per unique user address can be submitted at a time.
    // The fields included are what is required to construct a new Institution using the
    // Institution contract's constructor.
    // TODO: Will need to initialise isPending to true upon struct creation.
    struct ApprovalRequest {
        address submitter; // When constructing the unique request types, use this for the address, e.g. adminAddress, don't duplicate their address in data
        bool isPending;
        string approvalType;
        bytes32[] data;
        bool isInitialised;
    }

    // Store ApprovalRequests mapped by prospective admin addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // a flag that can evaulated to see if an address exists.
    mapping(address => ApprovalRequest) _approvalRequestQueue;

    function submitApprovalRequest(string memory approvalRequestType, bytes32[] memory requestData)
    public onlyOneRequest(msg.sender) isDuplicateApproval(msg.sender) {
        ApprovalRequest memory newApprovalRequest;

        // Initialise new approval request
        newApprovalRequest.submitter = msg.sender;
        newApprovalRequest.isPending = true;
        newApprovalRequest.approvalType = approvalRequestType;
        newApprovalRequest.data = requestData;
        newApprovalRequest.isInitialised = true;

        // Add the approval request to the approval queue mapping, mapped by the
        // prospective admin's address.
        _approvalRequestQueue[msg.sender] = newApprovalRequest;
    }

    function approveRequest(address submittingAddress) public {
        require(isApprovalStored(submittingAddress), "Approval not found");
    }

    modifier onlyOneRequest(address submittingAddress) {
        require(!_approvalRequestQueue[submittingAddress].isPending, "You have an outstanding request, please wait for that to be processed");
        _;
    }

    modifier isDuplicateApproval(address submittingAddress) {
        require(!_approvalRequestQueue[submittingAddress].isInitialised, "This approval has already been submitted!");
        _;
    }

    function isApprovalStored(address submittingAddress) public view returns(bool isStored) {
        return _approvalRequestQueue[submittingAddress].isInitialised;
    }

/*
    function isCorrectApprovalType(address submittingAddress, string memory approvalRequestType) public {
        require(_approvalRequestQueue[submittingAddress].approvalType.compareTo(approvalRequestType),"This approval has already been submitted!");
        _;
    } */

    function getRequest(address submittingAddress) public view returns(bool, string memory, bytes32[] memory ) {
        // require(isAdminStored(storedAdmin), "Admin address not found"); // TODO shouldn't need this, as we'll be using the array as the index.
        if (isApprovalStored(submittingAddress)) { // TODO this might not be reachable as the return is in the if if it's anything like Java and
        //the comment above should apply about using the array as the inex
            return (_approvalRequestQueue[submittingAddress].isPending, _approvalRequestQueue[submittingAddress].approvalType, _approvalRequestQueue[submittingAddress].data);
        }

    }

    /**
     * Self-destruct this contract // TODO expand explanation.
     * Kill() method taken and modified from: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
     */ // TODO add owner modifier to this
    function kill() external {
        selfdestruct(msg.sender);
    }

}