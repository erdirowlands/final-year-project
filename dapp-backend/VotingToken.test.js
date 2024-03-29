const BigNumber = web3.BigNumber;

const VotingToken = artifacts.require('VotingToken')

require('chai')
.use(require('chai-bignumber')(BigNumber))
.should();

const _name = 'Voting Token'
const _symbol = 'VTK';
const _decimals = 18

contract('VotingToken', accounts => {
  beforeEach(async function () {
    this.token = await VotingToken.new(_name, _symbol, _decimals)

  })

  describe('token attributes', function () {
    it('has the correct name', async function () {
      const name = await this.token.name();
      name.should.equal(_name);
    })

    it('has the correct symbol', async function () {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    })

    it('has the correct decimals', async function () {
      const decimals = (await this.token.decimals()).toNumber();
      decimals.should.be.bignumber.equal(_decimals);
    })

  })

})
