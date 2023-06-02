// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract oracle {
    mapping(address => uint256) parameter;
    
    struct Merkleinfo {
        bytes32[] proofOfuser;
        uint256 index;
        bool  IsTrue;
        uint256 amount;
    }
    mapping(address => Merkleinfo) merkleinfo;
    event GetPara(address from);
    event GetProof(address from);

    //触发线下监听
    function getPara(address user) public {
        emit GetPara(user);
    }
    function getProof(address user) public {
        emit GetProof(user);
    }
    //查看
    function getParaOfuser(address user) public view returns (uint256){
        return parameter[user];
    }
    function getProofOfuser(address user) public view returns (  Merkleinfo memory){
        return merkleinfo[user];
    }
    function getIsTrueOfuser(address user) public view returns (bool){
        return merkleinfo[user].IsTrue;
    }
    //修改值
    function setPara(address user,uint256 Para) public {
        parameter[user] = Para;
    }
    function setProof(address user,bytes32[] memory Proof,uint256 _index,uint256 amount,bool _isTrue) public {
       merkleinfo[user].proofOfuser = Proof;
       merkleinfo[user].index = _index;
       merkleinfo[user].amount = amount;
        merkleinfo[user].IsTrue = _isTrue;

    }
    //获取签名
    function getParahash() public pure returns (bytes32){
        bytes32 eventSignature = keccak256("GetPara(address)");
        return eventSignature;
    }  
    function getProofSignature() public pure returns (bytes32){
        bytes32 eventSignature = keccak256("GetProof(address)");
        return eventSignature;
    }

    //验证
    function verify(uint256 _index, uint256 _amount, bytes32[] calldata _proofs,address user,bytes32 merkleRoot)
    external
    returns(bool)
    {
        //验证默克尔树
        bytes32 _node = keccak256(abi.encodePacked(_index,user, _amount));
        bool _istrue = MerkleProof.verify(_proofs, merkleRoot, _node);
        if (_istrue == true){
                 merkleinfo[user].IsTrue = true;
        }else {
                merkleinfo[user].IsTrue = false;
        }
        return  merkleinfo[user].IsTrue;
    }
}
