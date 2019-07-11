pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Institution.sol";

// Name in progress - can possible be: ElectionFactory, though the current name indicates that this is the 'main entry point'.
/** // TODO Change comments based on new functionality - keep notion of factory pattern. Also mention that mappings adhere to storage patters found at: https://ethereum.stackexchange.com/questions/13167/are-there-well-solved-and-simple-storage-patterns-for-solidity
 * A contract which removes the requirement of university officials deploying their own instances of Election contracts.
 * This is achieved using a Smart Contract Factory pattern, in which new Election contracts are created and deployed from within this
 * contract.  This contract is interacted with on a "Purchase Election" screen, where university officials/customers can create and customise
 * a new election. TODO: This contract will surely create the Election admin accounts, but should it create them at the beggining of a purchase journey, and then
 * for the Election to be fully created, the customer will have to manually fund their address (or Voting System) with Ether? Or should it be for the purposes of this project, if a university
 * has access to this smart contract, then we can assume they've paid me with a debit card, or something, and I've authorised an account creation and added it to a list of approved addresses?  
*/
contract UniversityVoting is Ownable {

    // The payableOwner inherits from Open Zeppelin's Ownable contract
    // which is the deployer of the contract, i.e. the developer.
    // Should this contract need to be self-destructed, the developer will recieve all funds.
    address payable public payableOwner = address(uint160(owner()));

    // Store a request from a prospective admin who would like to register their Institution.
    // The flag "isPending" is included to stop potential abuse of the approval que - the intent
    // is that only one approval per unique user address can be submitted at a time.
    // The fields included are what is required to construct a new Institution using the
    // Institution contract's constructor.
    // TODO: Will need to initialise isPending to true upon struct creation.
    struct ApprovalRequest {
        bool isPending;
        string institutionName;
        string adminFirstName;
        string adminSurname;
        address adminAddress;
        // Allow us to query the approval queue to see if a request exists.
        bool isInitialised;
    }

    // Enable the prevention of duplicate addresses caused by
    // unforseen, errant client requests.
    struct InstitutionAddressStruct {
        bool isAddress;
    }

    // Store ApprovalRequests mapped by prospective admin addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // a flag that can evaulated to see if an address exists.
    mapping(address => ApprovalRequest) _approvalRequestQueue;

    // Store Institutions addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // a flag that can evaulated to see if an address exists.
    mapping(address => InstitutionAddressStruct) public _addressStructMapping;

    // Store Institution addresses in dynamically sized array so the complete state, including
    // the total number of Institutions stored can be quickly accessed.
    address[] public _addressArray;


    modifier hasPendingRequest(address adminAddress) {
        require(!_approvalRequestQueue[adminAddress].isPending, "You have an outstanding request, please wait for that to be processed");
        _;
    }

    modifier isDuplicateApproval(address adminAddress) {
        require(_approvalRequestQueue[adminAddress].isInitialised, "This approval has already been submitted!");
    }

    // Emit an event on Institution contract creation.
    event LogNewInstitution(address institution);


    /**
     * Initialises an approved Institution with admin.
     */
    function initialiseInstitutionWithAdmin()
        public onlyOwner {
        string memory institutionName = _approvalRequestQueue[msg.sender].institutionName;
        string memory firstName = _approvalRequestQueue[msg.sender].adminFirstName;
        string memory surname = _approvalRequestQueue[msg.sender].adminSurname;
        address adminAddress = _approvalRequestQueue[msg.sender].adminAddress;

        Institution institution = new Institution(institutionName, firstName, surname, adminAddress);
        address contractAddress = (address(institution));
        // Attempt to add new Institution address to mapping, will correctly fail if duplicate address found.
        addInstitutionAddresstoMapping(contractAddress);
        // Add address of newly created Institutions to dynamically sized array for quick access.
        _addressArray.push(contractAddress);
        // Also add the address to not interable mapping to allow for instant access to the address.
        _addressStructMapping[contractAddress] = InstitutionAddressStruct(true);
        // Emit the creation of the new Institution as an event.
        emit LogNewInstitution(contractAddress);
       // return contractAddress;
    }


    /**
     * Allows a prospective admin to submit the data for their new request. A ApprovalRequest is created and mapped
     * to the approval queue
     */
    function submitInstitutionApprovalRequest(
        string memory requestInstitutionName,string memory requestAdminFirstName,string memory requestAdminSurname)
        public {
        ApprovalRequest memory newApprovalRequest;

        // Initialise new approval request
        newApprovalRequest.isPending = true;
        newApprovalRequest.institutionName = requestInstitutionName;
        newApprovalRequest.adminFirstName = requestAdminFirstName;
        newApprovalRequest.adminSurname = requestAdminSurname;
        newApprovalRequest.adminAddress = msg.sender;
        newApprovalRequest.isInitialised = true;

        // Add the approval request to the approval queue mapping, mapped by the
        // prospective admin's address.
        _approvalRequestQueue[msg.sender] = newApprovalRequest;
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

    function addInstitutionAddresstoMapping(address institute) public {
        require(!isInstitutionAddressStored(institute),"This institution has already been added");
        _addressStructMapping[institute] = InstitutionAddressStruct(true);
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