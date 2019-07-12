const BigNumber = web3.BigNumber;

const Institution = artifacts.require('Institution')

require('chai')
.use(require('chai-bignumber')(BigNumber))
.should();


contract('Institution', accounts => {
  // UniversityVoting contract is responsible for deploying Institution, so mimick this flow in tests.
  let universityVoting;
  let institution;
  // Me, as the owner and deployer of the contract.
   const developerAccount = accounts[0];
  // Account for admin who makes a request for a new Institution
  const prospectiveAdminAccount = accounts[1];

  const institutionName = "Ulster University";
  const adminFirstName = "John";
  const adminSurname = "Francis";

  describe('deploy and use the child institution contract', function () {
    before(async function() {
      universityVoting = await UniversityVoting.new({ from: developerAccount });
      // Submit the approval from 'prospective admin' addresss
      await universityVoting.submitInstitutionApprovalRequest(
        institutionName,
        adminFirstName,
        adminSurname,
        { from: prospectiveAdminAccount }
      );
      // Developer Approves the request and UniversityVoting contract the new Institution contract.
      const result = await universityVoting.approveInstitutionCreation(
        prospectiveAdminAccount,
        { from: developerAccount }
      );
      // Get emitted event from initialiseInstitutionWithAdmin()
      const log = await result.logs[0].args;
      // Get newly created contract address from event
      newInstitutionContractAddress = await log.institution;
      );

    });
    after(async function() {
      await universityVoting.kill();
    });

    it('creates a new election', async function () {
    const result = await this.institution.createElection()
    })

    /*
    it('stores the election contract address', async function () {
        const result = await this.institution.createElection()
        // Get emitted event
        const log = await result.logs[0].args;
        // Get newly created contract address from event
        const newContractAddress = await log.election;
        // Check if the address stored in the elections array matches the newly created 
        // election.
        const createdElection = await this.institution.elections(0);
        createdElection.should.equal(newContractAddress);
        }) */

  })

})
