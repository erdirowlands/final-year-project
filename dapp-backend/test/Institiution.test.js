const BigNumber = web3.BigNumber;
const Utils = web3.utils;

const truffleAssert = require("truffle-assertions");
const { expectRevert, time, BN } = require("openzeppelin-test-helpers");
const { asciiToHex } = require("web3-utils");

const UniversityVoting = artifacts.require("UniversityVoting");
const Institution = artifacts.require("Institution");
const Election = artifacts.require("Election");
const VotingToken = artifacts.require("VotingToken");

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("Institution", accounts => {
  // UniversityVoting contract is responsible for deploying Institution, so mimick this flow in tests.
  let universityVoting;

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
  const fakeVoter = accounts[7];

  // Candidate accounts
  const prospectiveCandidate1 = accounts[8];
  const prospectiveCandidate2 = accounts[9];

  // Institution data
  const institutionName = "Ulster University";
  const adminName = "John Francis"; // An admin must be initialised with an Institution
  const newInstitutionRequestData = [institutionName, adminName];

  newRequestDataAsBytes32 = newInstitutionRequestData.map(
    newInstitutionRequestData => asciiToHex(newInstitutionRequestData)
  );

  // Admin data
  const newAdminRequestData = [adminName];

  newAdminRequestDataAsBytes32 = newAdminRequestData.map(newAdminRequestData =>
    asciiToHex(newAdminRequestData)
  );

  // Candidate data
  let candidateName = "Jeff James";
  const newCandidateRequestData = [candidateName];

  newCandidateRequestDataAsBytes32 = newCandidateRequestData.map(
    newCandidateRequestData => asciiToHex(newCandidateRequestData)
  );

  // Token amount for this mock election
  const tokenAmount = Utils.toWei("1", "ether");

  context("Institution contract deployed", async function() {
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
        const description = "Start of term election";
        await time.advanceBlock();
        const electionStartTime = await time.latest();
        const electionEndTime =
          (await electionStartTime) + time.duration.weeks(1);
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
        truffleAssert.eventEmitted(
          transactionReceipt,
          "NewElectionCreated",
          event => {
            return newElectionContractAddress.should.equal(event.election);
          }
        );
        newElectionContractInstance = await Election.at(
          newElectionContractAddress
        );
      });
      it("stores the new election address in array", async function() {
        // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
        // stores the address in the array.
        const electionAddressThatShouldBeStored = await newInstitutionContractAddress._electionAddresses(
          0
        );
        electionAddressThatShouldBeStored.should.equal(
          newElectionContractAddress
        );
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
        truffleAssert.eventEmitted(
          transactionReceipt,
          "NewCandidateApproved",
          event => {
            return prospectiveCandidate1.should.equal(event.candidate);
          }
        );
        // Check if candidate has been added to the Election created earlier.
        const isCandidateStored = await newElectionContractInstance.isCandidateAddressStored(
          prospectiveCandidate1
        );
        isCandidateStored.should.equal(true);
     //   const candidateArray = newElectionContractInstance._candidateArray(0);
      //  candidateArray.should.equal(prospectiveCandidate1);

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
        truffleAssert.eventEmitted(
          transactionApprovalReceipt,
          "NewCandidateApproved",
          event => {
            return prospectiveCandidate2.should.equal(event.candidate);
          }
        );
        // Check if candidate has been added to the Election created earlier.
        const isCandidateStored = await newElectionContractInstance.isCandidateAddressStored(
          prospectiveCandidate2
        );
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
        //   let decimals = Utils.toBN(18);
        //  let amount = Utils.toBN(10);
        //  let value = amount.mul(Utils.toBN(1).pow(decimals));
        const transactionReceipt = await newInstitutionContractAddress.approveVoterRequest(
          prospectiveVoter1,
          tokenAmount,
          { from: prospectiveAdmin1 }
        );
        truffleAssert.eventEmitted(
          transactionReceipt,
          "NewVoterApproved",
          event => {
            return prospectiveVoter1.should.equal(event.voter);
          }
        );
        // Check if the voter's token balance matches what was sent to them.
        const voterTokenBalance = await newElectionContractInstance.getTokenBalance(
          { from: prospectiveVoter1 }
        );
        // const usefulBalance = Utils.toWei(voterTokenBalance, 'ether');
        const actual = web3.utils.toBN(voterTokenBalance).toString();
        const before = web3.utils.toBN(tokenAmount).toString();
        actual.should.equal(before);
        //    usefulBalance.should.be.bignumber.equal(voterTokenBalance);
      });
      it("lets a second voter submit a request and get approved with 1 token", async function() {
        const transactionSubmissionReceipt = await newInstitutionContractAddress.submitVoterApprovalRequest(
          newElectionContractAddress,
          { from: prospectiveVoter2 }
        );
        //let decimals = Utils.toBN(18);
        //let amount = Utils.toBN(10);
        //let value = amount.mul(Utils.toBN(1).pow(decimals));
        const transactionReceipt = await newInstitutionContractAddress.approveVoterRequest(
          prospectiveVoter2,
          tokenAmount,
          { from: prospectiveAdmin1 }
        );
        truffleAssert.eventEmitted(
          transactionReceipt,
          "NewVoterApproved",
          event => {
            return prospectiveVoter2.should.equal(event.voter);
          }
        );
        // Get the voter's approved token balance.
        const voterTokenBalance = await newElectionContractInstance.getTokenBalance(
          { from: prospectiveVoter2 }
        );
        // Make sure the voter's new balance equals what was issued to them upon approval.
        const voterTokenBalanceBigNumber = web3.utils.toBN(voterTokenBalance).toString();
        const approvedTokenAmountBigNumber = web3.utils.toBN(tokenAmount).toString();
        voterTokenBalanceBigNumber.should.equal(approvedTokenAmountBigNumber);
      });
    });
    describe("Election voting", function() {
      it("lets a voter vote for a candidate by sending one voting token", async function() {
        /*   //  const tokenAmount = Utils.toWei('1', 'ether');
        let tokenAmountBefore = 1000000000000000000;
        let tokenAmountAfter = web3.utils.toBN(tokenAmountBefore).toString();
        const transactionReceipt = await newElectionContractInstance.vote(
          prospectiveCandidate1,
          //new BigNumber(Utils.toWei(1, 'ether')),
          tokenAmountAfter,
          { from: prospectiveVoter1 }
        ); */
        //  const voterTokenBalance = await newElectionContractInstance.getVoterTokenbalance(prospectiveVoter1);
        //   const actual  = web3.utils.toBN(voterTokenBalance).toString();
        //   actual.should.equal('1000000000000000000');
        const transactionReceipt = await newElectionContractInstance.vote(
          prospectiveCandidate1,
          tokenAmount,
          { from: prospectiveVoter1 }
        );
        const candidateTokenBalance = await newElectionContractInstance.getTokenBalance(
          { from: prospectiveCandidate1 }
        );
        // Get the voter's new token balance after the vote.
        const voterNewTokenBalance = await newElectionContractInstance.getTokenBalance(
          { from: prospectiveVoter1 }
        ); 
        // Make sure the balance is now zero.
        const voterBalanceBigNumber = web3.utils.toBN(voterNewTokenBalance).toString();
        voterBalanceBigNumber.should.equal('0');

        // Then make sure the candidate now has the token.
        const candidateBalanceBigNumber = web3.utils.toBN(candidateTokenBalance).toString();
        const votingAmountBigNumber = web3.utils.toBN(tokenAmount).toString();
        candidateBalanceBigNumber.should.equal(votingAmountBigNumber);
      });
      it("reverts if an approved voter tries to vote with no available tokens", async function() {
        await expectRevert(
          newElectionContractInstance.vote(
          prospectiveCandidate1,
          tokenAmount,
          { from: prospectiveVoter1 }
        ),
          "Voter doesn't have any Voting Tokens!"
        );
      });
      it("reverts if an unapproved address tries to vote ", async function() {
        await expectRevert(
          newElectionContractInstance.vote(
          prospectiveCandidate1,
          tokenAmount,
          { from: fakeVoter }
        ),
          "Voter address isn't stored"
        );
      });
    });
    describe("Election Conclusion", function() {
      it("gets the election results", async function() {
        const transactionSubmissionReceipt = await newInstitutionContractAddress.submitVoterApprovalRequest(
          newElectionContractAddress,
          { from: prospectiveVoter3 }
        );
        //let decimals = Utils.toBN(18);
        //let amount = Utils.toBN(10);
        //let value = amount.mul(Utils.toBN(1).pow(decimals));
        const transactionReceipt = await newInstitutionContractAddress.approveVoterRequest(
          prospectiveVoter3,
          tokenAmount,
          { from: prospectiveAdmin1 }
        );
        const transactionVoteReceipt = await newElectionContractInstance.vote(
          prospectiveCandidate2,
          tokenAmount,
          { from: prospectiveVoter2 }
        );
        const transactionVoteReceipt2 = await newElectionContractInstance.vote(
          prospectiveCandidate1,
          tokenAmount,
          { from: prospectiveVoter3}
        );
      const concludeElection = await newElectionContractInstance.concludeElection({from: prospectiveAdmin1});
      const winner = await  newElectionContractInstance.getVictor();
      winner.should.equal(prospectiveCandidate1);
      });
    }); 
  });
});
