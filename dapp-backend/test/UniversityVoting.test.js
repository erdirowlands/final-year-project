const { expectRevert } = require('openzeppelin-test-helpers');

const BigNumber = web3.BigNumber;

const UniversityVoting = artifacts.require("UniversityVoting");


require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();


contract("UniversityVoting", accounts => {
  let universityVoting;
  let newInstitutionContractAddress;
  const developerAccount = accounts[0];
  const unauthorisedAccount = accounts[9];
  beforeEach(async function() {
    universityVoting = await UniversityVoting.new({ from: developerAccount });
  });

  afterEach(async function() {
    await universityVoting.kill();
  });

  describe('Approving and creating a new Institution contract and operations on the newly created contract', function () {
    it("Approves and creates a new Institution contract.", async function() {
      // Create a new Institution with asscociated data (e.g. admin details)
       const result = await universityVoting.initialiseInstitutionWithAdmin({ from: developerAccount });
      // Get emitted event from initialiseInstitutionWithAdmin()
      const log = await result.logs[0].args;
      // Get newly created contract address from event
      newInstitutionContractAddress = await log.institution;
    }); 
    it("stores institution contract address in addresses array", async function() {
      // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
      // stores the address in the array.
      const addressThatShouldBeStored = await universityVoting._addressArray(0);
      addressThatShouldBeStored.should.equal(newInstitutionContractAddress);
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
      const isAddressStored = await universityVoting.isInstitutionAddressStored(newInstitutionContractAddress);
      isAddressStored.should.equal(true);
    });
    it("reverts when attempting to store a duplicate contract address in address mapping", async function() {
      await expectRevert(universityVoting.addInstitutionAddresstoMapping(newInstitutionContractAddress), 
        "This institution has already been added" );
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
