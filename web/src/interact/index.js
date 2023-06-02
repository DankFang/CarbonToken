/*
 * @Author: diana
 * @Date: 2023-05-23 16:50:41
 * @LastEditTime: 2023-06-02 19:20:46
 */
import React from 'react';
import {ethers}  from 'ethers';

import AMM from '../artifacts/contracts/transcation/CTAMM.sol/AMM.json'
// import Market from '../market.sol/Market.json';
import CTToken from '../artifacts/contracts/carbonToken.sol/CTToken.json';
import PUser from '../artifacts/contracts/dao/pUser.sol/PUserDao.json'
import Company from '../artifacts/contracts/dao/enterprise.sol/Enterprise.json';
import CarbonRecord from '../artifacts/contracts/carbonRecord.sol/carbonRecord.json';
import Market from '../artifacts/contracts/transcation/market.sol/Market.json';
import Weth from '../artifacts/contracts/weth.sol/WETH.json';
import Info from '../artifacts/contracts/info.sol/Info.json';
import IntenddantDao from '../artifacts/contracts/dao/intenddantDao.sol/IntendantDao.json';

export const MyContext = React.createContext();

const provider = new ethers.providers.Web3Provider(window.ethereum);
const address = window.ethereum.address;
const signer = provider.getSigner();

const contracts = [];

const addresses = [
  // amm 0
  "0x70eE70F48db66F8B09263fdfE33cfbD188a7644c",
  // ct 1
  "0xdAf95BB3326e41826d6d6feeb808d0105c8E38c0",
  // puser 2
  "0xFFb6c69A11fE72286bFdB8103e4fF2a8F04A953e",
  // company 3
  "0x889BA937AF1428Fb9839157d08a8c3A8e4fB4B7C",
  // record 4
  "0x04cBAbd6146eb3fd891eE2b6Ef0D8b3eA685E3F1",
  // market 5
  "0x0CE21429a2dD40533F9d5FC7DA8A906F8007692f",
  // weth 6
  "0x8571B323d06BE089E5619e3981bb3426330F36FC",
  // Info 7
  "0x0882e07D3995732e9F787013B5B4f5dfFee26597",
  // IntenddantDao 8
  "0xE2f3C5De42a5b40963b49117076f5ee8C6eFAF20",
]

// 0 
const amm = {
  address:addresses[0],
  abi:AMM.abi
}
const contractAMM = new ethers.Contract(amm.address, amm.abi, signer);
contracts.push(contractAMM)

// 1 
const ctToken = {
  address:addresses[1],
  abi:CTToken.abi
}
const contractCTToken = new ethers.Contract(ctToken.address, ctToken.abi, signer);
contracts.push(contractCTToken);

// 2
const pUser = {
  address:addresses[2],
  abi:PUser.abi,
}
const contractPUser = new ethers.Contract(pUser.address, pUser.abi, signer);
contracts.push(contractPUser);

// 3
const company = {
  address:addresses[3],
  abi:Company.abi
}
const contractCompany = new ethers.Contract(company.address, company.abi, signer);
contracts.push(contractCompany);

// 4
const carbonRecord = {
  address:addresses[4],
  abi:CarbonRecord.abi
}
const contractCarbonRecord = new ethers.Contract(carbonRecord.address, carbonRecord.abi,signer);
contracts.push(contractCarbonRecord);

// 5 market
const market = {
  address:addresses[5],
  abi:Market.abi
}
const contractMarket = new ethers.Contract(market.address, market.abi,signer);
contracts.push(contractMarket);

// 6
const weth = {
  address:addresses[6],
  abi:Weth.abi
}
const contractWeth = new ethers.Contract(weth.address, weth.abi,signer);
contracts.push(contractWeth);

// 7
const info = {
  address:addresses[7],
  abi:Info.abi
}
const contractInfo = new ethers.Contract(info.address, info.abi,signer);
contracts.push(contractInfo);

// 8
const intendant = {
  address:addresses[8],
  abi:IntenddantDao.abi
}
const contractIntendant = new ethers.Contract(intendant.address, intendant.abi,signer);
contracts.push(contractIntendant);
 


const MyProvider = ({ children }) => {
  return (
    <MyContext.Provider value={{ provider, signer, contracts,address }}>
      {children}
    </MyContext.Provider>
  );
};
export default MyProvider;