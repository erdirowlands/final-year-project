pragma solidity ^0.5.3;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Institution.sol";
import "./ApprovalQueue.sol";

// Name in progress - can possible be: ElectionFactory, though the current name indicates that this is the 'main entry point'.
/** // TODO Change comments based on new functionality - keep notion of factory pattern. Also mention that mappings adhere to storage patters found at: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
 * A contract which removes the requirement of university officials deploying their own instances of Election contracts.
 * This is achieved using a Smart Contract Factory pattern, in which new Election contracts are created and deployed from within this
 * contract.  This contract is interacted with on a "Purchase Election" screen, where university officials/customers can create and customise
 * a new election. TODO: This contract will surely create the Election admin accounts, but should it create them at the beggining of a purchase journey, and then
 * for the Election to be fully created, the customer will have to manually fund their address (or Voting System) with Ether? Or should it be for the purposes of this project, if a university
 * has access to this smart contract, then we can assume they've paid me with a debit card, or something, and I've authorised an account creation and added it to a list of approved addresses?  
*/
contract UniversityVoting is Ownable, ApprovalQueue {

    // The payableOwner inherits from Open Zeppelin's Ownable contract
    // which is the deployer of the contract, i.e. the developer.
    // Should this contract need to be self-destructed, the developer will recieve all funds.
    address payable public payableOwner = address(uint160(owner()));
    string constant public approvalRequestType = "institutionApprovalRequest";

    address deployedVotingToken;

    // Enable the prevention of duplicate addresses caused by
    // unforseen, errant client requests.
    struct InstitutionAddressStruct {
        bool isAddress;
    }

    constructor (address votingToken) public {
        deployedVotingToken = votingToken;
    }

    // Store Institutions addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // the flag isAddress that can evaulated to see if an address exists.
    mapping(address => InstitutionAddressStruct) public _addressStructMapping;

    // Store Institution addresses in dynamically sized array so the complete state, including
    // the total number of Institutions stored can be quickly accessed.
    address[] public _addressArray;

    // Emit an event on Institution contract creation.
    // TODO this can be in the superclass I think?
    event NewInstitutionApproved(address institution);

    function approveInstitutionRequest(address submittingAddress) public onlyOwner {
        super.approveRequest(submittingAddress);

        bytes32[] memory data = getRequestData(submittingAddress);
        string memory institutionName;
        string memory adminFirstName;
        string memory adminSurname;
        institutionName = super.bytes32ToString(data[0]);
        adminFirstName = super.bytes32ToString(data[1]);
        adminSurname = super.bytes32ToString(data[2]);

        Institution institution = new Institution(institutionName, adminFirstName, adminSurname, submittingAddress, deployedVotingToken);
        // Get the address of the newly created contract.
        address contractAddress = (address(institution));
        // Add information about the newly created contract so it can be accessed later.
        storeInstitutionContractInfo(contractAddress);
        // Emit the creation of the new Institution as an event.
        emit NewInstitutionApproved(contractAddress);
       // return contractAddress;
        // TODO add delete the approval from the mapping - but I might want to keep the data for the frontend.
        // if a backend as in place, could store in a database.
    }

    /**
     * Allows a prospective admin to submit the data for their new request. An ApprovalRequest is created and mapped
     * to the approval queue.
     */
    function submitInstitutionApprovalRequest(bytes32[] memory requestData) public {
       // institutionName adminFirstName adminSurname adminAddress
        super.submitApprovalRequest(approvalRequestType, requestData);
    }

    /**
     * Get the number of currently created Institutions
     */
    function getInstitutionsTotal() public view returns(uint total) {
        return _addressArray.length;
    }

    function getInstitutionAddresses() public view returns (address[] memory) {
        return _addressArray;
    }

    function storeInstitutionContractInfo(address institute) public {
        require(!isInstitutionAddressStored(institute),"This institution has already been added");
        // Add the address to not interable mapping to allow for instant access to the address.
        _addressStructMapping[institute] = InstitutionAddressStruct(true);
        // Also add address of newly created Institutions to dynamically sized array for quick access.
        _addressArray.push(institute);
        // New Institution created sucessfully so set the request to not pending.
        _approvalRequestQueue[institute].isPending = false;
    }

    function isInstitutionAddressStored(address institute) public view returns(bool isStored) {
        return _addressStructMapping[institute].isAddress;
    }

    function isApprovalStored(address adminAddress) public view returns(bool isStored) {
        return _approvalRequestQueue[adminAddress].isInitialised;
    }

    /**
     * Self-destruct this contract // TODO expand explanation.
     * Kill() method taken and modified from: https://kalis.me/check-events-solidity-smart-contract-test-truffle/
     */
    function kill() external onlyOwner {
        selfdestruct(payableOwner);
    }


}