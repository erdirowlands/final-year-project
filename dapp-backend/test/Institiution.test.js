const BigNumber = web3.BigNumber;
const truffleAssert = require("truffle-assertions");
const { expectRevert, time, BN } = require("openzeppelin-test-helpers");
const { asciiToHex } = require("web3-utils");


const UniversityVoting = artifacts.require("UniversityVoting");
const Institution = artifacts.require("Institution");
const Election = artifacts.require("Election");
const VotingToken= artifacts.require("VotingToken");

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("Institution", accounts => {
  // UniversityVoting contract is responsible for deploying Institution, so mimick this flow in tests.
  let universityVoting;

  // Voting token that gets deployed as part of the truffle migration script
  let votingToken;

  // The deployed child Institution contract address of UnviversityVoting.
  let newInstitutionContractAddress;

  // The deployed child Election contract address of Institution
  let newElectionContractAddress;
  let newElectionContractInstance;

  // My account as the owner and deployer of the contract.
  const developerAccount = accounts[0];
  // Admin accounts
  const prospectiveAdmin1 = accounts[1];
  const prospectiveAdmin2 = accounts[2];
  const prospectiveAdmin3 = accounts[3];

  // Voter accounts
  const prospectiveVoter1 = accounts[4];
  const prospectiveVoter2 = accounts[5];
  const prospectiveVoter3 = accounts[6];

  // Candidate accounts
  const prospectiveCandidate1 = accounts[7];
  const prospectiveCandidate2 = accounts[8];
  const prospectiveCandidate3 = accounts[9];

  // Institution data
  const institutionName = "Ulster University";
  const adminName = "John Francis"; // An admin must be initialised with an Institution
  const newInstitutionRequestData = [
    institutionName,
    adminName
  ];

  (newRequestDataAsBytes32 = newInstitutionRequestData.map(
    newInstitutionRequestData => asciiToHex(newInstitutionRequestData)
  ));

  // Admin data
  const newAdminRequestData = [
    adminName
  ];

  (newAdminRequestDataAsBytes32 = newAdminRequestData.map(
    newAdminRequestData => asciiToHex(newAdminRequestData)
  ));

  // Candidate data
  let candidateName = "Jeff James"
  const newCandidateRequestData = [
    candidateName
  ]; 

  (newCandidateRequestDataAsBytes32 = newCandidateRequestData.map(
    newCandidateRequestData => asciiToHex(newCandidateRequestData)
  ));

  context('Institution contract deployed', async function () {
    before(async function() {
      universityVoting = await UniversityVoting.deployed();
      // Submit the approval from 'prospective admin' addresss
      await universityVoting.submitInstitutionApprovalRequest(
        newRequestDataAsBytes32,
        { from: prospectiveAdmin1 }
      );
      // Developer Approves the request and UniversityVoting contract the new Institution contract.
      const transactionReceipt = await universityVoting.approveInstitutionRequest(
        prospectiveAdmin1,
        { from: developerAccount }
      );
      // Get emitted event from initialiseInstitutionWithAdmin()
      const log = await transactionReceipt.logs[0].args;
      // Get newly created contract address from event and use truffle-contract to get an instance.
      newInstitutionContractAddress = await Institution.at(log.institution);
    });
    after(async function() {
//       await universityVoting.kill();
//       await newInstitutionContractAddress.kill();
    });

    describe("Administrator actions", function() {
      it("submits a new admin aproval request", async function() {
        const transactionReceipt = await newInstitutionContractAddress.submitAdminApprovalRequest(
          newAdminRequestDataAsBytes32,
          { from: prospectiveAdmin2 }
        );
      });
      it("reverts on second admin approval request while original pending", async function() {
        await expectRevert(
          newInstitutionContractAddress.submitAdminApprovalRequest(
            newAdminRequestDataAsBytes32,
            { from: prospectiveAdmin2 }
          ),
          "You have an outstanding request, please wait for that to be processed"
        );
      });
      it("approves the new admin request.", async function() {
        const transactionReceipt = await newInstitutionContractAddress.approveAdminRequest(
          prospectiveAdmin2,
          { from: prospectiveAdmin1 }
        );
        truffleAssert.eventEmitted(transactionReceipt, "LogNewAdmin", event => {
          return prospectiveAdmin2.should.equal(event.newAdmin);
        });
      });

      it("stores the new admin address in array", async function() {
        // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
        // stores the address in the array.
        const adminThatShouldBeStored = await newInstitutionContractAddress._adminAddresses(
          1
        );
        adminThatShouldBeStored.should.equal(prospectiveAdmin2);
      }); 
      it("ensures admin has been initialised with the correct values", async function() {
        const resultName = await newInstitutionContractAddress.getInstitutionName();
        resultName.should.equal("Ulster University");

        // Get the admin's firstname, surname, address, and if they are authorised
        const admin = await newInstitutionContractAddress.getAdmin(
          prospectiveAdmin2
        );
        admin[0].should.equal("John Francis");
        admin[1].should.equal(true);
      });
      it("reverts when a currently unauthorised admin tries to add another admin", async function() {
        const newAdminName = "JimHolden ";
        await newInstitutionContractAddress.unauthoriseAdmin(prospectiveAdmin2);
        await expectRevert(
          newInstitutionContractAddress.addNewAdmin(
            newAdminName,
            prospectiveAdmin3,
            { from: prospectiveAdmin2 }
          ),
          "Caller is an admin, but not currently authorised!"
        );
      }); 
    });
    describe("Election creation", function() {
      it("creates a new election.", async function() {
    //    let date = (new Date()).getTime();
          const description = "Start of term election"
          await time.advanceBlock();
          const electionStartTime = await time.latest();
          const electionEndTime =  await electionStartTime + time.duration.weeks(1);
    //    let dateInUnixTimestamp = date / 1000;
          const transactionReceipt = await newInstitutionContractAddress.createElection(
          electionStartTime, 
          electionEndTime, 
          description,
          { from: prospectiveAdmin1 }
        );
        const log = await transactionReceipt.logs[0].args;
        // Get newly created contract address from event and use truffle-contract to get an instance.
        newElectionContractAddress = await log.election;
        truffleAssert.eventEmitted(transactionReceipt, "NewElectionCreated", event => {
          return newElectionContractAddress.should.equal(event.election);
        });
        newElectionContractInstance = await Election.at(newElectionContractAddress);
      }); 
      it("stores the new election address in array", async function() {
        // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
        // stores the address in the array.
        const electionAddressThatShouldBeStored = await newInstitutionContractAddress._electionAddresses(
          0
        );
        electionAddressThatShouldBeStored.should.equal(newElectionContractAddress);
      }); 
    }); 
    describe("Candidate approval requests", function() {
      it("lets a candidate submit a request", async function() {
        const transactionReceipt = await newInstitutionContractAddress.submitCandidateApprovalRequest(
          newCandidateRequestDataAsBytes32,
          newElectionContractAddress,
          { from: prospectiveCandidate1 }
        );
      }); 
      it("reverts on second candidate approval request while original pending", async function() {
        await expectRevert(
          newInstitutionContractAddress.submitCandidateApprovalRequest(
            newCandidateRequestDataAsBytes32,
            newElectionContractAddress,
            { from: prospectiveCandidate1 }
          ),
          "You have an outstanding request, please wait for that to be processed"
        );
      });
      it("lets admin approve the new candidate request", async function() {
        const transactionReceipt = await newInstitutionContractAddress.approveCandidateRequest(
          prospectiveCandidate1,
          { from: prospectiveAdmin1 }
        );
        truffleAssert.eventEmitted(transactionReceipt, "NewCandidateApproved", event => {
          return prospectiveCandidate1.should.equal(event.candidate);
        });
        // Check if candidate has been added to the Election created earlier.
        const isCandidateStored = await newElectionContractInstance.isCandidateAddressStored(prospectiveCandidate1);
        isCandidateStored.should.equal(true);
      });
      it("lets a second candidate submit a request and get approved", async function() {
        const transactionSubmissionReceipt = await newInstitutionContractAddress.submitCandidateApprovalRequest(
          newCandidateRequestDataAsBytes32,
          newElectionContractAddress,
          { from: prospectiveCandidate2 }
        );
        const transactionApprovalReceipt = await newInstitutionContractAddress.approveCandidateRequest(
          prospectiveCandidate2,
          { from: prospectiveAdmin1 }
        );
        truffleAssert.eventEmitted(transactionApprovalReceipt, "NewCandidateApproved", event => {
          return prospectiveCandidate2.should.equal(event.candidate);
        });
        // Check if candidate has been added to the Election created earlier.
        const isCandidateStored = await newElectionContractInstance.isCandidateAddressStored(prospectiveCandidate2);
        isCandidateStored.should.equal(true);
      }); 
    }); 
    describe("Voter approval requests", function() {
      it("lets a voter submit a request", async function() {
        const transactionReceipt = await newInstitutionContractAddress.submitVoterApprovalRequest(
          newElectionContractAddress,
          { from: prospectiveVoter1 }
        );
      }); 
      it("reverts on second voter approval request while original pending", async function() {
        await expectRevert(
          newInstitutionContractAddress.submitVoterApprovalRequest(
            newElectionContractAddress,
            { from: prospectiveVoter1 }
          ),
          "You have an outstanding request, please wait for that to be processed"
        );
      });
      it("lets admin approve the new voter request and issue 1 VotingToken", async function() {
        const tokenAmount = 1;
        const transactionReceipt = await newInstitutionContractAddress.approveVoterRequest(
          prospectiveVoter1,
          tokenAmount,
          { from: prospectiveAdmin1 }
        );
        truffleAssert.eventEmitted(transactionReceipt, "NewVoterApproved", event => {
          return prospectiveVoter1.should.equal(event.voter);
        });
        // Check if the voter's token balance matches what was sent to them.
        const voterTokenBalance = (await newElectionContractInstance.getVoterTokenbalance(prospectiveVoter1)).toNumber();
        tokenAmount.should.be.bignumber.equal(voterTokenBalance);
      });
    });
  });
});
