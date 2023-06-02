// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IPeInterface {
    function isClaimed(address user) external view returns (bool); 

    function isMember(address user) external view returns (bool);

    function getQuota() external view  returns (uint256);

}