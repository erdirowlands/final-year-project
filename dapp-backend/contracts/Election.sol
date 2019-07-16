pragma solidity ^0.5.3;

import "./Institution.sol";
import "./VotingTokenAuthorisation.sol";


contract Election {

    VotingTokenAuthorisation _votingTokenAuthorisation;
    
    // A pending Election will be when an Election admin has configured the Election to run
    // at some point in the future. This allows the contract to be deployed at the time
    // of admin interaction, but to start at a pre-defined time.
    enum ElectionStatus { IN_PROGRESS, TALLY, CONCLUDED }

    uint startTime;
    uint runningTime;
    VotingTokenAuthorisation tokenSale; // The address of the VotingTokenSale contract for this election
    Institution _institution;

    struct Candidate {
        string firstName;
        string surname;
        // TODO change name to reflect this could be fractional voting
        uint totalVotes;
        bool isVictor;
        // Allows a candidate to step down.
        bool isActive;
        // Allow the candidates mapping to be easily queried for admins that exist.
        bool isInitialised;
    }

    struct Voter {
        bool isInitialised;
        bool isAuthorised;
        bool hasVoted;
        uint vote;
    }

    // Store Candidate addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // the flag isInitialised that can evaulated to see if an address exists.
    mapping(address => Candidate) public _candidateMapping;
    // Store candidate addresses in array for quick acceess and to reveal more information
    // about contract state, such as bow many candidate there are.
    address[] public _candidateAddressArray;

    mapping(address => Voter) public _voterMapping;

    address[] public _voterAddressArray;


    constructor (address institution, VotingTokenAuthorisation votingTokenAuthorisation) public {
        _institution = Institution(institution);
        _votingTokenAuthorisation = votingTokenAuthorisation;
    }

    ///////////CANDIDATE DATA OPERATIONS///////////

    function addNewCandidate(address admin, string memory candidateFirstName, string memory candidateSurname, address candidateAddress)
    public {
        // Make sure caller is an Institution admin
        require(_institution.isAdminStored(admin), "Caller is not an admin!");
        // If an admin, make sure they are authorised
        require(_institution.isAdminAuthorised(admin), "Caller is an admin, but not currently authorised!");
        // Check for duplicate candidate address
        require(!isCandidateAddressStored(candidateAddress),"This candidateAddress address has already been added");
        // Add candidate to mapping for non-iterable access.
        _candidateMapping[candidateAddress] = Candidate(candidateFirstName, candidateSurname, 0, false,  true, true);
         // Add address of newly created candidate to dynamically sized array for quick access.
        _candidateAddressArray.push(candidateAddress);
    }

    function isCandidateAVictor(address candidate) public view returns(bool) {
        return _candidateMapping[candidate].isVictor;
    }

    function isCandidateActive(address candidate) public view returns(bool) {
        return _candidateMapping[candidate].isActive;
    }

    function isCandidateAddressStored(address candidate) public view returns(bool) {
        return _candidateMapping[candidate].isInitialised;
    }

    function getTotalCandidateVotes(address candidate) public view returns(uint) {
        return _candidateMapping[candidate].totalVotes;
    }

    function getTotalCandidates() public view returns(uint) {
        return _candidateAddressArray.length;
    }

    ///////////VOTER DATA OPERATIONS///////////

    modifier ableToVote(address voter) {
        require(isVoterAddressStored(voter), "Voter address isn't stored");
        require(isVoterAuthorised(voter), "Voter isn't authorised to vote!");
        require(!hasVoterVoted(voter), "Voter has already voted!");
        _;
    }

    function hasVoterVoted(address voter) public view returns(bool) {
        return _voterMapping[voter].hasVoted;
    }

    function isVoterAuthorised(address voter) public view returns(bool) {
        return _voterMapping[voter].isAuthorised;
    }

    function isVoterAddressStored(address voter) public view returns(bool) {
        return _voterMapping[voter].isInitialised;
    }

    function getTotalVoters() public view returns(uint total) {
        return _voterAddressArray.length;
    }

}