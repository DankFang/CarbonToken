// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CTToken is ERC20 {
    struct AddressInfo  {
        bool isEnterprise;
        bool isDistributed;
        bool isClaimed;
    }
    mapping(address => AddressInfo) private addressInfo;
    uint256 private currentYear;

    constructor() ERC20("CT", "CT") {
        _mint(msg.sender, 1000000 * (10 ** decimals()));
        currentYear = 1;
    }
    // 设置企业用户
    function setAddressInfo(address[] memory addresses, bool[] memory isEnterprise) external {
        require(addresses.length == isEnterprise.length, "Invalid input");

        for (uint256 i = 0; i < addresses.length; i++) {
            address addr = addresses[i];
            addressInfo[addr].isEnterprise = isEnterprise[i];
        }
    }
    // 发币
    function distributeTokens(address[] memory addresses, uint256[] memory amounts) external {
        require(addresses.length == amounts.length, "Invalid input");

        for (uint256 i = 0; i < addresses.length; i++) {
            require(amounts[i] > 0, "Amount must be greater than zero");

            address recipient = addresses[i];
            uint256 amount = amounts[i];

            require(!addressInfo[recipient].isDistributed, "Tokens already distributed for this year");

            if (addressInfo[recipient].isEnterprise) {
                // 分配给企业账户
                _transfer(msg.sender, recipient, amount);
                
            } else {
                // 分配给个人账户
                _transfer(msg.sender, recipient, amount);
            }

            addressInfo[recipient].isDistributed = true;
            addressInfo[recipient].isClaimed =true;
        }
    }
    function getClaimed(address user) external view returns(bool){
        return addressInfo[user].isClaimed;
    }
    function getEnterpriseType(address user) external view returns(bool){
        return addressInfo[user].isEnterprise;
    }
    function getDistributedType(address user) external view returns(bool){
        return addressInfo[user].isDistributed;
    }
    function nextYear() external {
        currentYear++;
        // resetDistributionStatus();
    }

    // function resetDistributionStatus() private {
    //     for (uint256 i = 0; i < addresses.length; i++) {
    //         addressInfo[addresses[i]].isDistributed = false;
    //     }
    // }
}
