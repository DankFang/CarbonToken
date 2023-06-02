// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// import "./enterprise.sol";
contract IntendantDao{

    //第三方,工商税务
    mapping(address=>bool) ICB;
    mapping(address=>bool) TAX;
    address CEDAddress;
    constructor(address CEDaddr){
        CEDAddress=CEDaddr;
    }
    // Enterprise public theEnterpriseDao;
    // // address public Enterprisedaoaddr;
    // constructor(address enterpriseDaoAddr){

    //     theEnterpriseDao=Enterprise(enterpriseDaoAddr);
    // }
    modifier OnlyCED{
        require(msg.sender==CEDAddress);
        _;
    }
    function isICB(address ICBaddr) external view returns (bool){
        return ICB[ICBaddr];
    }
    function isTAX(address TAXaddr) external view returns (bool){
        return TAX[TAXaddr];
    }
    function setICB(address addr) external {
        ICB[addr]=true;
    }
    function setTAX(address addr) external {
        TAX[addr] = true;
    }
    // function setType(address setEnterpriseAddress, uint256 _type) external{
    //     require(ICB[msg.sender]);
    //     theEnterpriseDao.setType(setEnterpriseAddress,_type);
    // }
}