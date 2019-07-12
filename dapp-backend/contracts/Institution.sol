pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Election.sol";

/**
An Institution can create Election Smart Contracts exclusivley for themselves. */
contract Institution  {

    string private _institutionName;

    struct InstitutionAdmin {
        string firstName;
        string surname;
        address adminAddress;
        bool isAuthorised;
        // Allow the mapping _institutionAdmins to be easily queried for admins that exist.
        bool isInitialised;
    }

    // Store authorised institution admins.
    // At some point in the future, they may be come de-authorised, for example
    // if an admin steps down and in which case the "isAuthorised" flag will be set to false.
    // Crucially, however, this mapping will only store owners that have been authorised in
    // the first instance.
    mapping(address => InstitutionAdmin) public _institutionAdmins;

    // Store admin addresses in array for quick acceess and to reveal more information
    // about contract state, such as bow many admins there are.
    address[] public _adminAddresses;

    InstitutionAdmin[] _institutionAdminArray;

    // Store the address of all prior-purchased elections.
    address[] public elections;

    // Emit an event when a new admin has been added.
    event LogNewAdmin(address newAdmin);

    // Emit an event on Election contract creation.
    event LogNewElection(address election);

    /**
     * @param institutionName the name of the new Institution
     * @param adminFirstName first name of the admin
     * @param adminSurname surname of the admin
     * @param adminAddress address of the admin
     */
    constructor (string memory institutionName, string memory adminFirstName, string memory adminSurname, address adminAddress)
    public {
        // Set the institution name.
        _institutionName = institutionName;

        // Store the admin details using their address.
        _institutionAdmins[adminAddress] = InstitutionAdmin(adminFirstName, adminSurname, adminAddress, true, true);
    }

    /**
    Create a new Election contract which can then be configured by a customer per their requirements. */
    function createElection()
    public
    returns (address newInstitution) {
        Election election = new Election();
        address contractAddress = (address(election));
        emit LogNewElection(contractAddress);
        elections.push(contractAddress);
        return contractAddress;
    }

    function isElectionStored(address election)
    public view
    returns (bool isStored) {

    }

    modifier isAdmin(address caller) {
        require(isAdminStored(caller), "Caller is not an admin!");
        _;
    }

    modifier isAuthorisedAdmin(address caller) {
        require(isAdminAuthorised(caller), "Caller is an admin, but not currently authorised!");
        _;
    }

    function addNewAdmin(string memory adminFirstName, string memory adminSurname, address adminAddress)
    public isAdmin(msg.sender) isAuthorisedAdmin(msg.sender) {
        // Check for duplicate admin address
        require(!isAdminStored(adminAddress),"This admin address has already been added");
        _institutionAdmins[adminAddress].isInitialised = true;
        _institutionAdmins[adminAddress] = InstitutionAdmin(adminFirstName, adminSurname, adminAddress, true, true);
        emit LogNewAdmin(adminAddress);
    }

    function unauthoriseAdmin(address admin) public {
        require(isAdminStored(admin),"Admin address not found!");
        require(isAdminAuthorised(admin),"Admin is already unauthorised!");
        _institutionAdmins[admin].isAuthorised = false;
    }

/*
    // TODO need to change this to get from the mapping.
    function getSpecificAdmin(address institutionOwner) public view returns (bool isOwner) {
        return _institutionAdmins[institutionOwner];
    } */

    function getAdmin(address storedAdmin) public view returns(string memory, string memory, address, bool) {
        // require(isAdminStored(storedAdmin), "Admin address not found"); // TODO shouldn't need this, as we'll be using the array as the index.
        if (isAdminStored(storedAdmin)) { // TODO this might not be reachable as the return is in the if if it's anything like Java and
        //the comment above should apply about using the array as the inex
            return (_institutionAdmins[storedAdmin].firstName, _institutionAdmins[storedAdmin].surname, _institutionAdmins[storedAdmin].adminAddress,
            _institutionAdmins[storedAdmin].isAuthorised);
        }

    }


    function isAdminStored(address admin) public view returns(bool isStored) {
        return _institutionAdmins[admin].isInitialised;
    }


    function isAdminAuthorised(address admin) public view returns(bool isStored) {
        return _institutionAdmins[admin].isAuthorised;
    }

/*
    function getAllAdmins() public returns(InstitutionAdmin memory admins){
        return _institutionAdminArray;
    } */

}