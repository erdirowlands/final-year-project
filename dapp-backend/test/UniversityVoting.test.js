const { expectRevert } = require("openzeppelin-test-helpers");
const { asciiToHex } = require("web3-utils");
const BigNumber = web3.BigNumber;
const UniversityVoting = artifacts.require("UniversityVoting");
const Institution = artifacts.require("Institution");
const VotingToken = artifacts.require("VotingToken");

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("UniversityVoting", accounts => {
  let universityVoting;
  let deployedVotingToken;
  let newInstitutionContractAddress;
  // Me, as the owner and deployer of the contract.
  const developerAccount = accounts[0];
  // Account for admin who makes a request for a new Institution
  const prospectiveAdminAccount = accounts[1];

  const newInstitutionRequestData = ["Ulster University", "John", "Francis"];
  (newRequestDataAsBytes32 = newInstitutionRequestData.map(
    newInstitutionRequestData => asciiToHex(newInstitutionRequestData)
  )),
    describe("Approving and creating a new Institution contract and operations on the newly created contract", function() {
      before(async function() {
        // Deploy Voting Token and University Voting contracts
        universityVoting = await UniversityVoting.deployed();
          from: developerAccount
      });
      after(async function() {
        await universityVoting.kill();
      });

      it("submits a new institution aproval request", async function() {
        const transactionReceipt = await universityVoting.submitInstitutionApprovalRequest(
          newRequestDataAsBytes32,
          { from: prospectiveAdminAccount }
        );
      });
      it("reverts on second approval request while original pending", async function() {
        await expectRevert(
          universityVoting.submitInstitutionApprovalRequest(
            newRequestDataAsBytes32,
            { from: prospectiveAdminAccount }
          ),
          "You have an outstanding request, please wait for that to be processed"
        );
      });

      it("approves and creates a new Institution contract.", async function() {
        const transactionReceipt = await universityVoting.approveInstitutionRequest(
          prospectiveAdminAccount,
          { from: developerAccount }
        );
        // Get emitted event from initialiseInstitutionWithAdmin()
        const log = await transactionReceipt.logs[0].args;
        // Get newly created contract address from event
        newInstitutionContractAddress = await log.institution;
      });
      it("reverts on a non-developer/'owner trying attempting to authorise an approval", async function() {
        // Create a new approval request.
        const transactionReceipt = await universityVoting.submitInstitutionApprovalRequest(
          newRequestDataAsBytes32,
          { from: accounts[5] } // This account is not the developer/owner, so it should be rejected.
        );
        await expectRevert(
          universityVoting.approveInstitutionRequest(accounts[5], {
            from: prospectiveAdminAccount
          }),
          "Ownable: caller is not the owner."
        );
      });
      it("stores institution contract address in addresses array", async function() {
        // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
        // stores the address in the array.
        const addressThatShouldBeStored = await universityVoting._addressArray(
          0
        );
        addressThatShouldBeStored.should.equal(newInstitutionContractAddress);
      });
      // approveRequst relies on some relativley contrived bytes32 manipulation, because
      // strings still really aren't a primitive type in solidity :(
      // so ensure that manipulation has been done correctly.
      it("ensures institution has been initialised with the correct values", async function() {
        deployedInstitutionContract = await Institution.at(
          newInstitutionContractAddress
        );
        const resultName = await deployedInstitutionContract.getInstitutionName();
        resultName.should.equal("Ulster University");

        // Get the admin's firstname, surname, address, and if they are authorised
        const admin = await deployedInstitutionContract.getAdmin(
          prospectiveAdminAccount
        );
        admin[0].should.equal("John");
        admin[1].should.equal("Francis");
        admin[2].should.equal(prospectiveAdminAccount);
        admin[3].should.equal(true);
      });
      it("reverts on attempting to approve a non-existent approval", async function() {
        await expectRevert(
          universityVoting.approveInstitutionRequest(developerAccount, {
            from: developerAccount
          }),
          "Approval not found"
        );
      });
      /*
    it("stores contract address in addresses mapping", async function() {
      // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
      // stores the address in the array.
      const isAddressStored = await universityVoting.isInstitutionAddressStored(
        newInstitutionContractAddress
      );
      isAddressStored.should.equal(true);
    });
    it("gets the number of stored instituion addresses", async function() {
      const totalAddresses = (await universityVoting.getInstitutionsTotal()).toNumber();
      totalAddresses.should.equal(1);
    });
    it("reverts when attempting to store a duplicate contract address in address mapping", async function() {
      await expectRevert(
        universityVoting.addInstitutionAddresstoMapping(
          newInstitutionContractAddress
        ),
        "This institution has already been added"
      );
    }); */
    });

  /* // TODO MOVE TO INSTITUTION TEST!!!
  describe("institution owners", function() {
    it("add a new institution owner", async function() {
      await this.universityVoting.addInstitutionOwners(accounts[1]);
      const newInstitutionOwner = await this.universityVoting._institutionAdmins(accounts[1]);
      newInstitutionOwner.should.equal(true);
    });

    it("get an institution owner", async function() {
      const institutionOwner = await this.universityVoting.getInstitutionOwner(accounts[0]);
      institutionOwner.should.equal(true);
    });
  }); */
});
