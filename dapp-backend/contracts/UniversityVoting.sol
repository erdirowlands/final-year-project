pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Institution.sol";

// Name in progress - can possible be: ElectionFactory, though the current name indicates that this is the 'main entry point'.
/**
A contract which removes the requirement of university officials deploying their own instances of Election contracts.
This is achieved using a Smart Contract Factory pattern, in which new Election contracts are created and deployed from within this
contract.  This contract is interacted with on a "Purchase Election" screen, where university officials/customers can create and customise
a new election. TODO: This contract will surely create the Election admin accounts, but should it create them at the beggining of a purchase journey, and then
for the Election to be fully created, the customer will have to manually fund their address (or Voting System) with Ether? Or should it be for the purposes of this project, if a university
has access to this smart contract, then we can assume they've paid me with a debit card, or something, and I've authorised an account creation and added it to a list of approved addresses?  e*/
contract UniversityVoting is Ownable {



    /** APPROVAL QUE FOR NEW INSTITUTION REQUESTS **/

    // Store a request from a prospective admin who would like to register their Institution.
    // The flag "isPending" is included to stop potential abuse of the approval que - the intent
    // is that only one approval per unique user address can be submitted at a time.
    // The fields included are what is required to construct a new Institution using the
    // Institution contract's constructor.
    // TODO: Will need to initialise isPending to true upon struct creation.
    struct pendingApproval {
        bool isPending;
        string institutionName;
        string adminFirstName;
        string adminSurname;
        address adminAddress;
        bool isAddress;
    }

    mapping(address => pendingApproval) approvalQueue;

    modifier isApproved(address approvedAdminAddress) {
        require(approvalQueue[approvedAdminAddress].isPending, "This request has not been approved yet!");
        _;
    }

    // Enable the prevention of duplicate addresses caused by
    // unforseen, errant client requests.
    struct InstitutionAddressStruct {
        bool isAddress;
    }

    // Store Institutions addresses so they can be accessed without iteration. This
    // limits gas costs.
    mapping(address => InstitutionAddressStruct) public _institutionAddressStructs;

    // Store Institution addresses in dynamically sized array so the complete state, including
    // the total number of Institutions stored can be quickly accessed.
    address[] public _institutionAddreses;

    // Emit an event on Institution contract creation.
    event LogNewInstitution(address institution);

    /* INITIALISE NEW INSTITUTION */

    /**
     * Initialises an approved Institution with admin.
     * @param institutionName name of the new institution.
     * @param adminFirstName new admin's first name.
     * @param adminSurname new admin's surname.
     */
    function initialiseInstitutionWithAdmin()
        public onlyOwner {
        string institutionName = approvalQueue[msg.sender].institutionName;
        string firstName = approvalQueue[msg.sender].adminFirstName;
        string surname = approvalQueue[msg.sender].adminSurname;
        address adminAddress = approvalQuer[msg.sender].adminAddress;

        Institution institution = new Institution(institutionName, firstName, surname, adminAddress, true, true);
        address contractAddress = (address(institution));
        // Guard against clients accidentally adding already created addresses.
        require(!isInstitutionAddressStored(contractAddress),"This institution has already been added");
        // Add address of newly created Institutions to dynamically sized array for quick access.
        _institutionAddreses.push(contractAddress);
        // Also add the address to not interable mapping to allow for instant access to the address.
        InstitutionAddressStruct[contractAddress].isAddress = true;
        // Emit the creation of the new Institution as an event.
        emit LogNewInstitution(contractAddress);
        return contractAddress;
    }


/*
    function requestInitialiseInstitutionWithAdmin(string memory institutionName, string memory adminFirstName, string memory adminSurname)
        public onlyOwner {
        Institution memory newInstitution;
    //    InstitutionAdmin memory newAdmin;

        // Initialise new institution
        newInstitution.institutionName = institutionName;
        newInstitution.initialised = true;

        //Initialise new admin
        newAdmin.firstName = adminFirstName;
        newAdmin.surname = adminSurname;
        newAdmin.isAuthorised = true;
    } */


/*
    /**
    Create a new Institution contract which then acts as the main customer facing contract, in that
    they can deploy Elections from within that contract, and control ownership roles etc. 
    function createInstitution() public
    returns (address newInstitution) {
        // Create new Inst
        Institution institution = new Institution();
        address contractAddress = (address(institution));
        // Guard against clients accidentally adding already created addresses.
        require(!_areInstitutionsStored[contractAddress],"This institution has already been added");
        emit LogNewInstitution(contractAddress);
        _institutions.push(contractAddress);
        return contractAddress;
    } */


    /**
     * Get the number of currently created Institutions
     */
    function getInstitutionsTotal() public view returns(uint total) {
        return _institutionAddreses.length;
    }

    function getInstitutionAddresses() public view returns (address[] memory) {
        return _institutionAddreses;
    }

    function isInstitutionAddressStored(address institute) public view returns(bool isStored) {
        return _institutionAddressStructs[institute].isAddress;
    }

    

}