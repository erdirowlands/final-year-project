const { expectRevert } = require("openzeppelin-test-helpers");

const BigNumber = web3.BigNumber;

const UniversityVoting = artifacts.require("UniversityVoting");

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("UniversityVoting", accounts => {
  let universityVoting;
  let newInstitutionContractAddress;
  // Me, as the owner and deployer of the contract.
  const developerAccount = accounts[0];
  // Account for admin who makes a request for a new Institution
  const prospectiveAdminAccount = accounts[1];

  const institutionName = "Ulster University";
  const adminFirstName = "John";
  const adminSurname = "Francis";

  describe("Approving and creating a new Institution contract and operations on the newly created contract", function() {
    before(async function() {
      universityVoting = await UniversityVoting.new({ from: developerAccount });
    });
    after(async function() {
      await universityVoting.kill();
    });

    it("submits a new aproval request", async function() {
      const result = universityVoting.submitInstitutionApprovalRequest(
        institutionName,
        adminFirstName,
        adminSurname,
        { from: prospectiveAdminAccount }
      );
    });
    it("reverts on second approval request while original pending", async function() {
      await expectRevert(
        universityVoting.submitInstitutionApprovalRequest(
          institutionName,
          adminFirstName,
          adminSurname,
          { from: prospectiveAdminAccount }
        ),
        "You have an outstanding request, please wait for that to be processed"
      );
    });
    it("approves and creates a new Institution contract.", async function() {
      const result = await universityVoting.approveInstitutionCreation(
        prospectiveAdminAccount,
        { from: developerAccount }
      );
      // Get emitted event from initialiseInstitutionWithAdmin()
      const log = await result.logs[0].args;
      // Get newly created contract address from event
      newInstitutionContractAddress = await log.institution;
    });
    it("reverts on attempting to approve a non-existent approval", async function() {
      await expectRevert(
        universityVoting.approveInstitutionCreation(
          developerAccount,
          { from: developerAccount }
        ),
        "Approval not found"
      );
    }); 
    it("stores institution contract address in addresses array", async function() {
      // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
      // stores the address in the array.
      const addressThatShouldBeStored = await universityVoting._addressArray(0);
      addressThatShouldBeStored.should.equal(newInstitutionContractAddress);
    });
    it("stores contract address in addresses mapping", async function() {
      // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
      // stores the address in the array.
      const isAddressStored = await universityVoting.isInstitutionAddressStored(
        newInstitutionContractAddress
      );
      isAddressStored.should.equal(true);
    });
    it("reverts when attempting to store a duplicate contract address in address mapping", async function() {
      await expectRevert(
        universityVoting.addInstitutionAddresstoMapping(
          newInstitutionContractAddress
        ),
        "This institution has already been added"
      );
    });
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
