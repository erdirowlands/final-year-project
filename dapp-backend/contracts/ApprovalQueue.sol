pragma solidity ^0.5.3;

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
        address election;
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

    /**
     *
     * @dev inherriting contracts must override this based on their requirements.
     */
    function approveRequest(address submittingAddress) public  view {
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

    function getRequestData(address submittingAddress) public view returns(bytes32[] memory ) {
        // require(isAdminStored(storedAdmin), "Admin address not found"); // TODO shouldn't need this, as we'll be using the array as the index.
        if (isApprovalStored(submittingAddress)) { // TODO this might not be reachable as the return is in the if if it's anything like Java and
        //the comment above should apply about using the array as the inex
            return  _approvalRequestQueue[submittingAddress].data;
        }
    }

    /**
     * Helper method to get data from a request
     * Taken from https://ethereum.stackexchange.com/questions/29295/how-to-convert-a-bytes-to-string-in-solidity
     */
    function bytes32ToString(bytes32 x) public pure returns (string memory) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (uint j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

// Taken from https://ethereum.stackexchange.com/questions/67436/a-solidity-0-5-x-function-to-convert-adress-string-to-ethereum-address
    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }

    /**
     * Self-destruct this contract // TODO expand explanation.
     * Kill() method taken and modified from: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
     */ // TODO add owner modifier to this
    function kill() external {
        selfdestruct(msg.sender);
    }

}