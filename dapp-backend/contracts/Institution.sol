pragma solidity ^0.5.3;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Election.sol";
import "./ApprovalQueue.sol";
import "./VotingTokenAuthorisation.sol";
import "./VotingToken.sol";


/**
An Institution can create Election Smart Contracts exclusivley for themselves. */
contract Institution is ApprovalQueue {

    string public _institutionName;

    VotingTokenAuthorisation public _tokenAuthorisation;
    VotingToken public _deployedVotingToken;

    struct InstitutionAdmin {
        string name;
        bool isAuthorised;
        // Allow the mapping _institutionAdmins to be easily queried for admins that exist.
        bool isInitialised;
    }

    // Enable the prevention of duplicate addresses caused by
    // unforseen, errant client requests.
    struct VoterRequestStruct {
        bool isPending;
        bool isAuthorised;
        bool isInitialised;
    }

    // Enable the prevention of duplicate addresses caused by
    // unforseen, errant client requests.
    struct ElectionAddressStruct {
        bool isAddress;
    }

    // Store Election addresses so they can be accessed without iteration. This
    // limits gas costs. This also means that we can efficiently keep track of whether
    // or not an address is stored, because the Struct that is mapped to the address contains
    // the flag isAddress that can evaulated to see if an address exists.
    mapping(address => ElectionAddressStruct) public _electionAddressMapping;

    // Store authorised institution admins.
    // At some point in the future, they may be come de-authorised, for example
    // if an admin steps down and in which case the "isAuthorised" flag will be set to false.
    // Crucially, however, this mapping will only store owners that have been authorised in
    // the first instance.
    mapping(address => InstitutionAdmin) public _institutionAdmins;

    // Authorised voters
    mapping(address => VoterRequestStruct) public _voterRequests;

    // Store admin addresses in array for quick acceess and to reveal more information
    // about contract state, such as bow many admins there are.
    address[] public _adminAddresses;

    // Store the address of all prior-purchased elections.
    address[] public _electionAddresses;

    // Emit an event when a new admin has been added.
    event LogNewAdmin(address newAdmin);

    // Emit an event on Election contract creation.
    event LogNewElection(address election);

    /**
     * @param institutionName the name of the new Institution
     * @param adminName full name of the admin who submitted the new institution request
     * @param adminAddress addres of  the admin who submitted the new institution request
     */
    constructor (string memory institutionName, string memory adminName, address adminAddress, VotingToken deployedVotingToken)
    public {
        // Set the institution name.
        _institutionName = institutionName;

        // Store details of the first admin to be approved
        require(!isAdminStored(adminAddress),"This admin address has already been added");
        _institutionAdmins[adminAddress] = InstitutionAdmin(adminName, true, true);
         // Add address of newly created Institutions to dynamically sized array for quick access.
        _adminAddresses.push(adminAddress);
        // Give Institution access to the deployed voting token
        _deployedVotingToken = deployedVotingToken;
    }

    function getInstitutionName() public view returns(string memory) {
        return _institutionName;
    }

    ///////////ADMIN APPROVAL REQUEST FLOW ///////////


    // Emit an event on Institution contract creation.
    event NewAdminApproved(address admin);

    function approveAdminRequest(address submittingAddress) public {
        super.approveRequest(submittingAddress);

        bytes32[] memory data = getRequestData(submittingAddress);
        string memory adminName;
        adminName = super.bytes32ToString(data[0]);
        // Store the new admin info in mapping and array.
        addNewAdmin(adminName, submittingAddress);

        // New Institution created sucessfully so set the request to not pending.
        _approvalRequestQueue[submittingAddress].isPending = false;
        // Emit the succesfull approval of the new admin.

        emit LogNewAdmin(submittingAddress);
    }

    function submitAdminApprovalRequest(bytes32[] memory requestData) public {
       // institutionName adminFirstName adminSurname adminAddress
        super.submitApprovalRequest("adminApprovalRequest", requestData);
    }
    

    function addNewAdmin(string memory adminName, address adminAddress)
    public isAdmin(msg.sender) isAuthorisedAdmin(msg.sender) {
        // Check for duplicate admin address
        require(!isAdminStored(adminAddress),"This admin address has already been added");
        _institutionAdmins[adminAddress] = InstitutionAdmin(adminName, true, true);
         // Add address of newly created Institutions to dynamically sized array for quick access.
        _adminAddresses.push(adminAddress);
    }

    function unauthoriseAdmin(address admin) public {
        require(isAdminStored(admin),"Admin address not found!");
        require(isAdminAuthorised(admin),"Admin is already unauthorised!");
        _institutionAdmins[admin].isAuthorised = false;
    }

    modifier isAdmin(address caller) {
        require(isAdminStored(caller), "Caller is not an admin!");
        _;
    }

    modifier isAuthorisedAdmin(address caller) {
        require(isAdminAuthorised(caller), "Caller is an admin, but not currently authorised!");
        _;
    }

    function getAdmin(address storedAdmin) public view returns(string memory, bool) {
        // require(isAdminStored(storedAdmin), "Admin address not found"); // TODO shouldn't need this, as we'll be using the array as the index.
        if (isAdminStored(storedAdmin)) { // TODO this might not be reachable as the return is in the if if it's anything like Java and
        //the comment above should apply about using the array as the inex
            return (_institutionAdmins[storedAdmin].name, _institutionAdmins[storedAdmin].isAuthorised);
        }

    }

    function isAdminStored(address admin) public view returns(bool isStored) {
        return _institutionAdmins[admin].isInitialised;
    }


    function isAdminAuthorised(address admin) public view returns(bool isStored) {
        return _institutionAdmins[admin].isAuthorised;
    }


    ///////////ELECTION OPERATIONS///////////

    // Emit an event on Institution contract creation.
    event NewElectionCreated(address election);
    /**
    Create a new Election contract which can then be configured by a customer per their requirements. */
    function createElection(uint256 openingTime, uint256  closingTime, string memory description) public isAdmin(msg.sender) isAuthorisedAdmin(msg.sender) {
        _tokenAuthorisation = new VotingTokenAuthorisation(Institution(this), msg.sender, openingTime, closingTime, _deployedVotingToken);
        // Let VotingTokenAuthorisation have the role as minter so it can mint tokens for voters upon request.
        _deployedVotingToken.addMinter(address(_tokenAuthorisation));
        // Create new Election contract.
        Election election = new Election(address(this), _tokenAuthorisation, _deployedVotingToken, description, openingTime, closingTime);
        // Get the address of the newly created Election contract.
        address electionContractAddress = (address(election));
        // Add information about the newly created contract so it can be accessed later.
        storeNewElection(electionContractAddress, msg.sender);
        // Emit the creation of the new Election as an event.
        emit NewElectionCreated(electionContractAddress);
    }

    function storeNewElection(address election, address admin) public isAdmin(admin) isAuthorisedAdmin(admin) {
        // Check for duplicate election address
        require(!isElectionAddressStored(election),"This election address has already been added");
        _electionAddressMapping[election] = ElectionAddressStruct(true);
         // Add address of newly created Institutions to dynamically sized array for quick access.
        _electionAddresses.push(election);
    }

    function isElectionAddressStored(address election) public view returns (bool) {
        return _electionAddressMapping[election].isAddress;
    }

    ///////////CANDIDATE APPROVAL OPERATIONS///////////

    // Emit an event on Institution contract creation.
    event NewCandidateApproved(address candidate);

    function approveCandidateRequest(address submittingAddress) public {
        super.approveRequest(submittingAddress);

        bytes32[] memory data = getRequestData(submittingAddress);
        string memory candidateName;
        candidateName = super.bytes32ToString(data[0]);
        address election = _approvalRequestQueue[submittingAddress].election;
        Election(election).addNewCandidate(msg.sender, candidateName, submittingAddress);
        // New Institution created sucessfully so set the request to not pending.
        _approvalRequestQueue[submittingAddress].isPending = false;
        // Emit the succesfull approval of the new admin.

        emit NewCandidateApproved(submittingAddress);
    }

    function submitCandidateApprovalRequest(bytes32[] memory requestData, address electionAddress) public {
        require(!_approvalRequestQueue[msg.sender].isPending, "You have an outstanding request, please wait for that to be processed");
        require(!isApprovalStored(msg.sender), "This approval has already been submitted!");
        ApprovalRequest memory newApprovalRequest;
        // Initialise new approval request
        newApprovalRequest.submitter = msg.sender;
        newApprovalRequest.isPending = true;
        newApprovalRequest.approvalType = "candidateApprovalRequest";
        newApprovalRequest.data = requestData;
        newApprovalRequest.election = electionAddress;
        newApprovalRequest.isInitialised = true;

        // Add the approval request to the approval queue mapping, mapped by the
        // prospective admin's address.
        _approvalRequestQueue[msg.sender] = newApprovalRequest;
    }

    // Emit an event on voter approval.
    event NewVoterApproved(address voter);
    function approveVoterRequest(address submittingAddress, uint amount) public isAdmin(msg.sender){
        super.approveRequest(submittingAddress);

        //the comment above should apply about using the array as the inex
        address election = _approvalRequestQueue[submittingAddress].election;
        _tokenAuthorisation.sendVotingToken(submittingAddress, amount, msg.sender);
        // Store the new admin info in mapping and array.
        Election(election).addNewVoter(submittingAddress, msg.sender, amount);

        // New Institution created sucessfully so set the request to not pending.

        _approvalRequestQueue[submittingAddress].isPending = false;
        emit NewVoterApproved(submittingAddress);
    }

    // Request data will contain election address they are requesting approval for!!!
    function submitVoterApprovalRequest(address electionAddress) public {
        require(!_approvalRequestQueue[msg.sender].isPending, "You have an outstanding request, please wait for that to be processed");
        require(!isApprovalStored(msg.sender), "This approval has already been submitted!");
        ApprovalRequest memory newApprovalRequest;
        // Initialise new approval request
        newApprovalRequest.submitter = msg.sender;
        newApprovalRequest.isPending = true;
        newApprovalRequest.approvalType = "voterApprovalRequest";
        newApprovalRequest.election = electionAddress;
        newApprovalRequest.isInitialised = true;

        // Add the approval request to the approval queue mapping, mapped by the
        // prospective admin's address.
        _approvalRequestQueue[msg.sender] = newApprovalRequest;
    }


    function setVotingTokenAddress(VotingToken votingToken) public {
        _deployedVotingToken = votingToken;
    }

    function getVotingTokenAddress() public view returns (VotingToken) {
        return _deployedVotingToken;
    }

}