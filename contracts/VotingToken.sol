pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract VotingToken is ERC20, ERC20Mintable, ERC20Detailed{

    constructor (string memory _name, string memory _symbol, uint8 _decimals)
    ERC20Detailed(_name, _symbol, _decimals) public {
    }

    function test(address _to, uint256 _value) public returns (bool) {
        return super.transfer(_to, _value);
    }

}