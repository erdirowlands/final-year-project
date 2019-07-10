pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Election.sol";

/**
An Institution can create Election Smart Contracts exclusivley for themselves. */
contract Institution  {


    struct InstitutionDetails {
        // Negate the need for using a counter to keep track of additions.
        bool initialised;
        string name;
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



    // Store the address of all prior-purchased elections.
    address[] public elections;

    // Emit an event on Election contract creation.
    event LogNewElection(address election);

    constructor (string memory institutionName, string memory adminFirstName, string memory adminSurname) public {
        InstitutionDetails.institutionName = adminFirstName;
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
}