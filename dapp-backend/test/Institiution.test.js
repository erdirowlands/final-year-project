const BigNumber = web3.BigNumber;

const truffleAssert = require("truffle-assertions");
const { expectRevert } = require("openzeppelin-test-helpers");
const { asciiToHex } = require("web3-utils");

const UniversityVoting = artifacts.require("UniversityVoting");
const Institution = artifacts.require("Institution");

require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("Institution", accounts => {
  // UniversityVoting contract is responsible for deploying Institution, so mimick this flow in tests.
  let universityVoting;
  // The deployed child institution contract address.
  let newInstitutionContractAddress;
  // Me, as the owner and deployer of the contract.
  const developerAccount = accounts[0];
  // Account for admin who makes a request for a new Institution (will become approved in the before hook).
  const prospectiveAdmin1 = accounts[1];
  const prospectiveAdmin2 = accounts[2];

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
    describe("Deploy and use the child institution contract", function() {
      before(async function() {
        universityVoting = await UniversityVoting.new({
          from: developerAccount
        });
        // Submit the approval from 'prospective admin' addresss
        await universityVoting.submitInstitutionApprovalRequest(
          newRequestDataAsBytes32,
          { from: prospectiveAdmin1 }
        );
        // Developer Approves the request and UniversityVoting contract the new Institution contract.
        const transactionReceipt = await universityVoting.approveRequest(
          prospectiveAdmin1,
          { from: developerAccount }
        );
        // Get emitted event from initialiseInstitutionWithAdmin()
        const log = await transactionReceipt.logs[0].args;
        // Get newly created contract address from event and use truffle-contract to get an instance.
        newInstitutionContractAddress = await Institution.at(log.institution);
      });
      after(async function() {
        await universityVoting.kill();
        await newInstitutionContractAddress.kill();
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
        const transactionReceipt = await newInstitutionContractAddress.approveRequest(
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
      }); /*
      it("lets an approved institution admin add another admin", async function() {
        const newAdminFirstName = "Ben";
        const newAdminSurname = "Sisko";
        const newAdminAddress = accounts[3];

        const transactionReceipt = await newInstitutionContractAddress.addNewAdmin(
          newAdminFirstName,
          newAdminSurname,
          newAdminAddress,
          { from: prospectiveAdmin2 }
        );
        truffleAssert.eventEmitted(transactionReceipt, "LogNewAdmin", event => {
          return newAdminAddress.should.equal(event.newAdmin);
        });
      }); */ /*
      it("stores the address of admin approved by other admin address in array", async function() {
        // Check if initialiseInstitutionWithAdmin() called from the beforeEach hook
        // stores the address in the array.
        const adminThatShouldBeStored = await newInstitutionContractAddress._adminAddresses(
          1
        );
        adminThatShouldBeStored.should.equal(accounts[2]);
      }); */
      // approveRequst relies on some relativley contrived bytes32 manipulation, because
      // strings still really aren't a primitive type in solidity :(
      // so ensure that manipulation has been done correctly.
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
        const newAdminAddress = accounts[4];
        // Unauthorise Ben Sisko's account from the previous test to serve as the now unauthorised admin.
        await newInstitutionContractAddress.unauthoriseAdmin(accounts[2]);
        await expectRevert(
          newInstitutionContractAddress.addNewAdmin(
            newAdminFirstName,
            newAdminSurname,
            newAdminAddress,
            { from: accounts[2] }
          ),
          "Caller is an admin, but not currently authorised!"
        );
      });

      //  const log = await transactionReceipt.logs[0].args;

      //  newAdminAddress.should.equal(log.adminAddress);

      /*
    it('stores the election contract address', async function () {
        const transactionReceipt = await this.institution.createElection()
        // Get emitted event
        const log = await transactionReceipt.logs[0].args;
        // Get newly created contract address from event
        const newContractAddress = await log.election;
        // Check if the address stored in the elections array matches the newly created 
        // election.
        const createdElection = await this.institution.elections(0);
        createdElection.should.equal(newContractAddress);
        }) */
    });
});
