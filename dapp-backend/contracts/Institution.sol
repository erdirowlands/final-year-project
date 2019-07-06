pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Election.sol";

/**
An Institution can create Election Smart Contracts exclusivley for themselves. */
contract Institution  {


    // Store the address of all prior-purchased elections.
    address[] public elections;

    // Emit an event on Election contract creation.
    event LogNewElection(address election);

    constructor () public {
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