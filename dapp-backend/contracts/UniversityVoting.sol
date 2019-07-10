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

    struct Institution {
        // Negate the need for using a counter to keep track of additions.
        bool initialised;
        string institutionName;
        mapping(address => InstitutionAdmin) adminInfo;
    }

    struct InstitutionAdmin {
        string firstName;
        string surname;
        bool isAuthorised;
    }

    mapping(uint => Institution) public _institutions;

    // Store the address of created Institutions
    //address[] public _institutions;

    // Store authorised institution owners.
    mapping(address => bool) public _institutionAdmins;

    // Simple way to check if an In address is stored.
    // TODO Use for election
    mapping(address => bool) public _areInstitutionsStored;

    // Emit an event on Election contract creation.
    event LogNewInstitution(address institution);

    constructor () public {
    }

    function initialiseInstitutionWithAdmin(string memory institutionName, string memory adminFirstName, string memory adminSurname)
        public onlyOwner {
        Institution memory newInstitution;
        InstitutionAdmin memory newAdmin;

        // Initialise new institution
        newInstitution.institutionName = institutionName;
        newInstitution.initialised = true;

        //Initialise new admin
        newAdmin.firstName = adminFirstName;
        newAdmin.surname = adminSurname;
        newAdmin.isAuthorised = true;
    }

    function requestInitialiseInstitutionWithAdmin(string memory institutionName, string memory adminFirstName, string memory adminSurname)
        public onlyOwner {
        Institution memory newInstitution;
        InstitutionAdmin memory newAdmin;

        // Initialise new institution
        newInstitution.institutionName = institutionName;
        newInstitution.initialised = true;

        //Initialise new admin
        newAdmin.firstName = adminFirstName;
        newAdmin.surname = adminSurname;
        newAdmin.isAuthorised = true;
    }


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

    function addInstitutionOwners(address institutionOwner) public onlyOwner {
       // _institutionAdmins.push(institutionOwner);
        require(!_institutionAdmins[institutionOwner],"This institution owner has already been added");
        _institutionAdmins[institutionOwner] = true;
    }

    function getInstitutionOwner(address institutionOwner) public view returns (bool isOwner) {
        return _institutionAdmins[institutionOwner];
    }

    function getInstitutionsTotal() public view returns(uint total) {
        return _institutions.length;
    }

    function getInstitutionAddresses() public view returns (address[] memory) {
        return _institutions;
    }

    function isInstitutionAddressStored(address institute) public view returns(bool isStored) {
        return _areInstitutionsStored[institute];
    }

}