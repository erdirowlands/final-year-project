const BigNumber = web3.BigNumber;

const truffleAssert = require("truffle-assertions");
const { expectRevert, time } = require("openzeppelin-test-helpers");
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

  // Admin data
  const institutionName = "Ulster University";
  const adminFirstName = "John";
  const adminSurname = "Francis";

  const newInstitutionRequestData = [
    institutionName,
    adminFirstName,
    adminSurname
  ];

  const newAdminRequestData = [
    adminFirstName,
    adminSurname
  ];

  (newRequestDataAsBytes32 = newInstitutionRequestData.map(
    newInstitutionRequestData => asciiToHex(newInstitutionRequestData)
  ));

  (newAdminRequestDataAsBytes32 = newAdminRequestData.map(
    newAdminRequestData => asciiToHex(newAdminRequestData)
  ));

  // Election Candidate data
  const candidateFirstName = "Abraham";
  const candidateSurname = "Lincoln";    

    describe("Deploy and use the child institution contract", function() {
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
        admin[0].should.equal("John");
        admin[1].should.equal("Francis");
        admin[2].should.equal(prospectiveAdmin2);
        admin[3].should.equal(true);
      });
      it("reverts when a currently unauthorised admin tries to add another admin", async function() {
        const newAdminFirstName = "Jim";
        const newAdminSurname = "Holden";
        await newInstitutionContractAddress.unauthoriseAdmin(prospectiveAdmin2);
        await expectRevert(
          newInstitutionContractAddress.addNewAdmin(
            newAdminFirstName,
            newAdminSurname,
            prospectiveAdmin3,
            { from: prospectiveAdmin2 }
          ),
          "Caller is an admin, but not currently authorised!"
        );
      }); 
      it("creates a new election.", async function() {
    //    let date = (new Date()).getTime();
          await time.advanceBlock();
          const electionStartTime = await time.latest();
          const electionEndTime =  await electionStartTime + time.duration.weeks(1);
    //    let dateInUnixTimestamp = date / 1000;
          const transactionReceipt = await newInstitutionContractAddress.createElection(
          electionStartTime, 
          electionEndTime, 
          { from: prospectiveAdmin1 }
        );
        const log = await transactionReceipt.logs[0].args;
        // Get newly created contract address from event and use truffle-contract to get an instance.
        newElectionContractAddress = await log.election;
        truffleAssert.eventEmitted(transactionReceipt, "NewElectionCreated", event => {
          return newElectionContractAddress.should.equal(event.election);
        });
      }); 
      it("stores the new election address in array", async function() {
        // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
        // stores the address in the array.
        const electionAddressThatShouldBeStored = await newInstitutionContractAddress._electionAddresses(
          0
        );
        electionAddressThatShouldBeStored.should.equal(newElectionContractAddress);
      }); 
      it("lets a voter submit a request", async function() {
        let voterRequestData = [newElectionContractAddress]; 
        (voterRequestData = newInstitutionRequestData.map(
          voterRequestData => asciiToHex(voterRequestData)
        ));
        const transactionReceipt = await newInstitutionContractAddress.submitVoterApprovalRequest(
          newAdminRequestDataAsBytes32,
          { from: prospectiveVoter1 }
        );
      }); 
      it("let admin approve the new voter request and issue 1 VotingToken.", async function() {
        const tokenAmount = 1;
        const transactionReceipt = await newInstitutionContractAddress.approveVoterRequest(
          prospectiveVoter1,
          tokenAmount,
          { from: prospectiveAdmin1 }
        );
        truffleAssert.eventEmitted(transactionReceipt, "NewVoterApproved", event => {
          return prospectiveVoter1.should.equal(event.voter);
        });
      });
    });
});
