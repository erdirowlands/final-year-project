const BigNumber = web3.BigNumber;

const UniversityVoting = artifacts.require("UniversityVoting");

let newInstitutionContractAddress;

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();


contract("UniversityVoting", accounts => {
  beforeEach(async function() {
    this.universityVoting = await UniversityVoting.new();
    this.result = await this.universityVoting.initialiseInstitutionWithAdmin();
    const log = await this.result.logs[0].args;
    this.newContractAddress = await log.institution;

    // this.universityVoting.addInstitutionOwners(accounts[0]);

  });

    describe('Operations on created Institution contract', function () {

    it("creates and stores a second institution contract address", async function() {
      const result = await this.universityVoting.initialiseInstitutionWithAdmin();
      // Get emitted event
      const log = await result.logs[0].args;
      // Get newly created contract address from event
      const newContractAddress = await log.institution;
      // Check if the address stored in the institutions array matches the newly created
      // institution which will be at index 1, not 0 due to setting up contract in beforeEach.
      const createdInstitution = await this.universityVoting._institutionAddreses(1);
      createdInstitution.should.equal(newContractAddress);
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
