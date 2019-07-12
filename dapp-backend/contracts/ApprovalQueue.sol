pragma solidity ^0.5.2;

contract ApprovalQueue {

    /** 
     * Initially, each contract that required some sort of approval functionality, whether that was for approving voters, or new institution
     * admins, contained their own unique approval queues. That approach proved to be in violation of the DRY principle, as the underlying requirements
     * for approving a request were the same. Therefore, the concept was generalised into this utility contract, with the approval data required to be
     * "split" around some basic regex - in this case, a comma.
     */
    struct ApprovalRequest {
        bool isPending;
        string approvalType;
        string data;
        bool isInitialised;
    }

    // Store ApprovalRequests mapped by prospective admin addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // a flag that can evaulated to see if an address exists.
    mapping(address => ApprovalRequest) _approvalRequestQueue;

    modifier onlyOneRequest(address adminAddress) {
        require(!_approvalRequestQueue[adminAddress].isPending, "You have an outstanding request, please wait for that to be processed");
        _;
    }

    modifier isDuplicateApproval(address adminAddress) {
        require(!_approvalRequestQueue[adminAddress].isInitialised, "This approval has already been submitted!");
        _;
    }

    function isApprovalStored(address adminAddress) public view returns(bool isStored) {
        return _approvalRequestQueue[adminAddress].isInitialised;
    }

}