pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./VotingToken.sol";

contract Election is Ownable {

    VotingToken public _token;

    constructor () public {

    }

    // A pending Election will be when an Election admin has configured the Election to run
    // at some point in the future. This allows the contract to be deployed at the time
    // of admin interaction, but to start at a pre-defined time.
    enum ElectionStatus { PENDING, IN_PROGRESS, TALLY, CONCLUDED }

    struct ElectionDetails {
        uint startTime;
    }

    struct Candidate {
        string name;
        // TODO change name to reflect this could be fractional voting
        uint totalVotes;
        bool victor;
        // Allows a candidate to step down.
        bool active;
        // Allow the candidates mapping to be easily queried for admins that exist.
        bool isInitialised;
    }

    // Store Candidate addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // the flag isInitialised that can evaulated to see if an address exists.
    mapping(address => Candidate) public _candidateMapping;
    // Store candidate addresses in array for quick acceess and to reveal more information
    // about contract state, such as bow many candidate there are.
    address[] public _candidateAddressArray;


    function test(VotingToken token) public {
        _token = token;
    }

    function isCandidateAddressStored(address candidate) public view returns(bool isStored) {
        return _candidateMapping[candidate].isInitialised;
    }

}