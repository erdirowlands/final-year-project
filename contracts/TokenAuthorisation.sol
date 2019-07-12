pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";


/**
The authorisation of Voting Tokens is implemented as a crowdsale - however the concept of purchasing tokens for Ether
is not utilised here. Instead, election administrators need only initiate a token transfer once they have checked
a voter's student card/approved ID. A token will then be minted and then transferred to the user. */
contract TokenAuthorisation is MintedCrowdsale, TimedCrowdsale {
    
}