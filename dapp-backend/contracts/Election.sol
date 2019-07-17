pragma solidity ^0.5.3;

import "./Institution.sol";
import "./VotingTokenAuthorisation.sol";


contract Election {


    
    // A pending Election will be when an Election admin has configured the Election to run
    // at some point in the future. This allows the contract to be deployed at the time
    // of admin interaction, but to start at a pre-defined time.
    enum ElectionStatus { CANDIDATES_APPROVAL, IN_PROGRESS, CONCLUDED }

    uint _openingTime;
    uint _closingTime;
    ElectionStatus public _electionStatus;
    VotingToken public _votingToken;
    VotingTokenAuthorisation public _votingTokenAuthorisation; // The address of the VotingTokenSale contract for this election
    Institution public _institution;
    string public _description;
    address public _victor;

    struct Candidate {
        string name;
        // Allow the candidates mapping to be easily queried for admins that exist.
        bool isInitialised;
    }

    struct Voter {
        bool isInitialised;
        uint votingTokenBalance;
    }

    // Store Candidate addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // the flag isInitialised that can evaulated to see if an address exists.
    mapping(address => Candidate) public _candidateMapping;
    // Store candidate addresses in array for quick acceess and to reveal more information
    // about contract state, such as bow many candidate there are.

    address[] _candidateArray;

    // Saving gas cost and using a simple counter as opposed to an array which isn't required for small amount of candidates
   // uint _candidateCounter;

    mapping(address => Voter) public _voterMapping;

    address[] public _voterAddressArray;


    constructor (address institution, VotingTokenAuthorisation votingTokenAuthorisation,
    VotingToken votingToken, string memory description, uint openingTime, uint closingTime)
    public {
        _votingTokenAuthorisation = votingTokenAuthorisation;
        _institution = Institution(institution);
        _votingToken = votingToken;
        _electionStatus = ElectionStatus.CANDIDATES_APPROVAL;
        _description = description;
        _openingTime = openingTime;
        _closingTime = closingTime;
    }

    // TODO add isAdmin modifier for code document
    function beginElection() public {
        _electionStatus = ElectionStatus.CONCLUDED;
    }

    // TODO add isAdmin modifier for code document
    function concludeElection() public  {
        require(now > _closingTime, "The election is still within the set time");
        require(_institution.isAdminStored(msg.sender), "Caller is not an admin!");
        _electionStatus = ElectionStatus.IN_PROGRESS;
    }

    function determineVictor() internal {
        uint tokenCounter;
        for (uint i = 0; i <= _candidateArray.length; i++ ) {
            if (tokenCounter < _votingToken.balanceOf(_candidateArray[i]))
            tokenCounter = _votingToken.balanceOf(_candidateArray[i]);
            _victor = _candidateArray[i];
        }
        
    }
    
    modifier isAdmin(address admin) {
        // Make sure caller is an Institution admin
        require(_institution.isAdminStored(admin), "Caller is not an admin!");
        _;
    }

    ///////////VOTING///////////

    function vote(address candidate,  uint weight) public ableToVote(msg.sender) {
        _votingToken.vote(msg.sender, candidate, weight);
    }

    ///////////CANDIDATE DATA OPERATIONS///////////

    function addNewCandidate(address admin, string memory candidateName, address candidateAddress)
    public isAdmin(admin) {

        // Check for duplicate candidate address
        require(!isCandidateAddressStored(candidateAddress),"This candidateAddress address has already been added");
        // Add candidate to mapping for non-iterable access.
        _candidateMapping[candidateAddress] = Candidate(candidateName, true);
        // Keep track of total candidates for later usage, especially when tallying votes.
        _candidateArray.push(candidateAddress);
    }

    function isCandidateAddressStored(address candidate) public view returns(bool) {
        return _candidateMapping[candidate].isInitialised;
    }

    ///////////VOTER DATA OPERATIONS///////////

    function addNewVoter(address voter, address admin, uint tokenAmount)
    public isAdmin(admin) {
        // Check for duplicate voter address
        require(!isVoterAddressStored(voter),"This candidateAddress address has already been added");
        // Add voter to mapping for non-iterable access.
        _voterMapping[voter] = Voter(true, tokenAmount);
         // Add address of newly created voter to dynamically sized array for quick access.
        _voterAddressArray.push(voter);
    }

    modifier ableToVote(address voter) {
        require(isVoterAddressStored(voter), "Voter address isn't stored");
        require(getTokenBalance() != 0, "Voter doesn't have any Voting Tokens!");
        _;
    }

    function isVoterAddressStored(address voter) public view returns(bool) {
        return _voterMapping[voter].isInitialised;
    }

    function getTokenBalance() public view returns(uint) {
   //     return _voterMapping[voter].votingTokenBalance;
        return _votingToken.balanceOf(msg.sender);
    } 

    function getTotalVoters() public view returns(uint total) {
        return _voterAddressArray.length;
    }

}