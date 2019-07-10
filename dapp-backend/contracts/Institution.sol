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
        bool isAuthorised;
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

    // Store the address of all prior-purchased elections.
    address[] public elections;

    // Emit an event on Election contract creation.
    event LogNewElection(address election);

    constructor (string memory institutionName, string memory adminFirstName, string memory adminSurname, address adminAddress)
    public {
        // Set the institution name.
        _institutionName = institutionName;

        // Store the admin details using their address.
        _institutionAdmins[adminAddress] = InstitutionAdmin(adminFirstName, adminSurname, true);
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


    function addInstitutionOwners(address institutionOwner) public onlyOwner {
       // _institutionAdmins.push(institutionOwner);
        require(!_institutionAdmins[institutionOwner],"This institution owner has already been added");
        _institutionAdmins[institutionOwner] = true;
    }

    function getInstitutionOwner(address institutionOwner) public view returns (bool isOwner) {
        return _institutionAdmins[institutionOwner];
    }

    function isAdminAddressStored(address admin) public view returns(bool isStored) {
        return _adminAddresses[admin];
    }
}