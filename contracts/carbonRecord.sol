// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./dao/CEDDao.sol";
import "./carbonToken.sol";


contract carbonRecord{
    mapping(address=>uint256) total_emission;
    mapping(address=>uint256) notemission;
    mapping(address=>uint256) debt;

    CEDDao private CED;
    CTToken private CT;

    constructor(address payable CtAddress,address payable CEDDaoAddress) {
        CT = CTToken(CtAddress);
        CED = CEDDao(CEDDaoAddress);
    }

    function isUntrustworthy(address addr) external view returns(bool){
        if(notemission[addr] >0 ){
            return true;
        }
        return false;
    }
    function recordEmission(address addr,uint256 record) external {
        require(CED.isMember(addr),"must be the CED");
        CT.transferFrom(addr,CT.getAdmin(),record);
    }

}