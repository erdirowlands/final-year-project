const { expectRevert } = require('openzeppelin-test-helpers');

const BigNumber = web3.BigNumber;

const UniversityVoting = artifacts.require("UniversityVoting");


require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();


contract("UniversityVoting", accounts => {
  beforeEach(async function() {
    this.universityVoting = await UniversityVoting.new();
    // Create a new Institution with asscociated data (e.g. admin details)
    const result = await this.universityVoting.initialiseInstitutionWithAdmin();
    // Get emitted event from initialiseInstitutionWithAdmin()
    const log = await result.logs[0].args;
    // Get newly created contract address from event
    this.newInstitutionContractAddress = await log.institution;

    // this.universityVoting.addInstitutionOwners(accounts[0]);

  });

    describe('Operations on created Institution contract', function () {
    it("stores institution contract address in addresses array", async function() {
      // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
      // stores the address in the array.
      const addressThatShouldBeStored = await this.universityVoting._institutionAddreses(0);
      addressThatShouldBeStored.should.equal(this.newInstitutionContractAddress);
    });
    it("stores institution contract address in addresses mapping", async function() {
      // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
      // stores the address in the array.
      const isAddressStored = await this.universityVoting.isInstitutionAddressStored(this.newInstitutionContractAddress);
      isAddressStored.should.equal(true);
    });
    it("stops duplicate institution contract addresses being stored in mapping", async function() {
    await expectRevert(this.universityVoting.addInstitutionAddresstoMapping(this.newInstitutionContractAddress), 
      "This institution has already been added" );
    });
    it("stops duplicate institution contract addresses being stored in array", async function() {
    //    assert.throw(function() { this.universityVoting.addInstitutionAddresstoMapping(this.newInstitutionContractAddress) }, Error);
      //  this.universityVoting.addInstitutionAddresstoMapping(this.newInstitutionContractAddress);
     //  this.universityVoting.addInstitutionAddresstoMapping(this.newInstitutionContractAddress);
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
