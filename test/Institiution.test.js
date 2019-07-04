const BigNumber = web3.BigNumber;

const Institution = artifacts.require('Institution')

require('chai')
.use(require('chai-bignumber')(BigNumber))
.should();


contract('Institution', accounts => {
  beforeEach(async function () {
    this.institution = await Institution.new()

  })

  describe('election contract creation', function () {
    it('creates a new election', async function () {
    const result = await this.institution.createElection()
    })

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
        })

  })

})
