pragma solidity ^0.5.3;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./UniversityVoting.sol";


contract VotingToken is ERC20Mintable, ERC20Detailed{

    
    UniversityVoting universityVoting;

    

    constructor (address universityVotingAddress, string memory name, string memory symbol, uint8 decimals)
    ERC20Detailed(name, symbol, decimals) public {
        address payable payableUniversityVoting = address(uint160(universityVotingAddress));
        universityVoting = UniversityVoting(payableUniversityVoting);
        addMinter(address(universityVoting));
        _mint(address(universityVoting), 1000);
    }

    function vote(address sender, address recipient, uint256 value) public  {
        return super._transfer(sender, recipient, value);
    }

}