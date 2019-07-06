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
    }

    function test(VotingToken token) public {
        _token = token;
    }

}