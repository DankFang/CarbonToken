// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/carbonToken.sol";
import "./IpeInterface.sol";
import  "contracts/oracle.sol";

contract PUserDao is IPeInterface {
    uint256 constant  quota = 1; 
    mapping(address => bool) public members;
    CTToken private CT;
    address public oracleAddress = 0x84654Ad82e3a6da51f460E120D234C7F2579469d;
    bytes32 public root;

    constructor(address payable CtAddress) {
        CT = CTToken(CtAddress);
    }
    function getQuota() external view returns (uint256){
        return quota;
    }
    function _isClaimed(address user) internal view returns (bool) {
        return CT._isDistributed(user);
    }

    function _isMember(address user) internal  returns (bool) {
        oracle _oracle = oracle(oracleAddress);
         members[user] = _oracle.getIsTrueOfuser(user);
        return _oracle.getIsTrueOfuser(user);
    }
    function initUser (address user)external {
        members[user] = _isMember(user);
    }
    function isClaimed(address user) external view returns (bool) {
        return _isClaimed(user);
    }

    function isMember(address user) external view returns (bool) {
        return members[user];
    }
    function LetMembertoTrue(address user) external   {
        members[user] = true;
    }
    // function LetMembertoTrue(address user) external   {
        
    //     }
    function claim() external {
        require(members[msg.sender], "Address is not a member");
        CT.distributeTokens(msg.sender,quota);
        // CT.transferFrom(CT.getAdmin(),msg.sender,quota);
    }
}
