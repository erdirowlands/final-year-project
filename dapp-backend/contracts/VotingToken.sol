pragma solidity ^0.5.3;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./UniversityVoting.sol";


contract VotingToken is ERC20Mintable, ERC20Detailed{

    string constant private _name = "Voting Token";
    string constant private  _symbol = "VTK";
    uint8 constant private  _decimals = 18;

    UniversityVoting universityVoting;

    constructor (address universityVotingAddress)
    ERC20Detailed(_name, _symbol, _decimals) public {
        universityVoting = UniversityVoting(universityVotingAddress);
        addMinter(address(universityVoting));
        _mint(address(universityVoting), 1000);
    }

    function test(address _to, uint256 _value) public returns (bool) {
        return super.transfer(_to, _value);
    }

}