// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract carbonRecord{
    mapping(address=>uint256) total_emission;
    mapping(address=>uint256) notemission;
    mapping(address=>uint256) debt;
    function isUntrustworthy(address addr) external returns(bool){

    }
    function recordEmission(address addr,uint256 record) external returns(uint){
        
    }

}