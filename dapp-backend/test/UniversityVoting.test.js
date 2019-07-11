const BigNumber = web3.BigNumber;

const UniversityVoting = artifacts.require("UniversityVoting");

let newInstitutionContractAddress;

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();


contract("UniversityVoting", accounts => {
  beforeEach(async function() {
    this.universityVoting = await UniversityVoting.new();
    // Create a new Institution with asscociated data (e.g. admin details)
    this.result = await this.universityVoting.initialiseInstitutionWithAdmin();
    // Get emitted event from initialiseInstitutionWithAdmin()
    const log = await this.result.logs[0].args;
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
    it("stops duplicate institution contract addresses being stored in mapping", async function() {
      assert.throw(function() { this.universityVoting.addInstitutionAddresstoMapping(newInstitutionContractAddress) }, Error);
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
