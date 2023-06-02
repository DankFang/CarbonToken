package main

import (
	"Server/mod/models"
	"bytes"
	"context"
	"encoding/gob"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"log"
	"math/big"
	"strings"
	"time"
)

const (
	infuraURL       = "wss://polygon-mumbai.g.alchemy.com/v2/cVEt-fnCUJl8EuLm6CFKNLZWQ62Ubegu"
	contractAddress = "0x0Dd72250C90535D4a4c239Cb81dd6e8c64b7b0E1"
	privateKey      = "b0e2f2d36b21e73b036f20b9a3bc4fe28abf51081f2681fd42bcb0ca6a3ed7df"
	contractABI     = `[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			}
		],
		"name": "GetPara",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			}
		],
		"name": "GetProof",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getIsTrueOfuser",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getPara",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getParaOfuser",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getParahash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getProof",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getProofOfuser",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32[]",
						"name": "proofOfuser",
						"type": "bytes32[]"
					},
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "IsTrue",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"internalType": "struct oracle.Merkleinfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getProofSignature",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "Para",
				"type": "uint256"
			}
		],
		"name": "setPara",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "bytes32[]",
				"name": "Proof",
				"type": "bytes32[]"
			},
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_isTrue",
				"type": "bool"
			}
		],
		"name": "setProof",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes32[]",
				"name": "_proofs",
				"type": "bytes32[]"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "merkleRoot",
				"type": "bytes32"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]`
	oracleInterval     = 1 * time.Minute
	dbConnectionString = "YOUR_DB_CONNECTION_STRING"
)

type LogGetPara struct {
	User common.Address
}
type LogGetProof struct {
	User common.Address
}

func main() {
	models.Init()
	event1 := "0x42c2f6aff5c444f55ffb01c4c2a26005bbc000c92d4f15f46a1d54984b1fca91"
	event2 := "0xa73a6e07be7becfca28cc6ba81d59eda02b467020759f49b1784492cb93a0c92"
	client, err := ethclient.Dial(infuraURL)

	contractABI, err := abi.JSON(strings.NewReader(contractABI))
	if err != nil {
		log.Fatal(err)
	}
	contractAddr := common.HexToAddress(contractAddress)
	contract := bind.NewBoundContract(contractAddr, contractABI, client, client, client)
	query := ethereum.FilterQuery{
		//FromBlock: big.NewInt(2394201),
		//ToBlock:   big.NewInt(2394201),
		Addresses: []common.Address{contractAddr},
		Topics:    [][]common.Hash{{common.HexToHash("0x42c2f6aff5c444f55ffb01c4c2a26005bbc000c92d4f15f46a1d54984b1fca91"), common.HexToHash("0xa73a6e07be7becfca28cc6ba81d59eda02b467020759f49b1784492cb93a0c92")}},
	}
	logs := make(chan types.Log)
	sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	if err != nil {
		log.Fatal(err)
	}
	for {
		select {
		case err := <-sub.Err():
			log.Fatal(err)
		case vLog := <-logs:
			fmt.Println("进入监听")
			eventSignature := vLog.Topics[0].Hex()
			fmt.Println(eventSignature)
			switch eventSignature {
			case event1:
				fmt.Printf("Log Name: GetPara\n")
				var GetPara LogGetPara
				value, err := contractABI.Unpack("GetPara", vLog.Data)
				if err != nil {
					log.Fatal(err)
				}
				GetPara.User = common.HexToAddress(vLog.Address.Hex())
				fmt.Printf("user address: %s\n", value[0])
				fmt.Printf("vLog address: %s\n", value[0])
				str := fmt.Sprintf("%v", value[0])
				data := getCompanyDetail(str)
				fmt.Printf("data:%v", data)
				err = uploadDataToContract(contract, str, big.NewInt(data), client)
				if err != nil {
					log.Fatal(err)
				}
			case event2:
				fmt.Printf("Log Name: GetProof\n")
				var GetProof LogGetProof
				value, err := contractABI.Unpack("GetProof", vLog.Data)
				if err != nil {
					log.Fatal(err)
				}
				GetProof.User = common.HexToAddress(vLog.Address.Hex())
				fmt.Printf("user address: %s\n", value[0])
				fmt.Printf("vLog address: %s\n", value[0])
				str := fmt.Sprintf("%v", value[0])
				data, info, isTrue := getProof(str)
				index := int64(info.Id - 1)
				err = uploadProofToContract(contract, str, data, big.NewInt(index), big.NewInt(info.Amount), isTrue, client)
				if err != nil {
					fmt.Println("上传参数")
					log.Fatal(err)
				}
			default:
				// 未知的事件签名，忽略或处理其他类型的日志
				fmt.Println("Received Unknown Log")
			}

		}

		fmt.Printf("\n\n")
	}
}
func getCompanyDetail(address string) (para int64) {
	models.DB.Raw("SELECT type\nFROM `a_companydetail` where address = ?", address).Scan(&para)
	return
}
func getManageDetail(address string) (isTrue bool) {
	var manage models.Manage
	var count int64
	models.DB.Raw("SELECT * FROM `a_manage` where address = ?", address).Scan(&manage).Count(&count)
	if count > 0 {
		isTrue = true
	}
	return
}
func getAdminDetail(address string) (isTrue bool) {
	var manage models.Admin
	var count int64
	models.DB.Raw("SELECT * FROM `a_admin` where address = ?", address).Scan(&manage).Count(&count)
	if count > 0 {
		isTrue = true
	}
	return
}

func getProof(address string) (retrievedData [][32]byte, Data models.MerkleTreeSql, isTrue bool) {
	var byteArray []byte
	var count int64
	//var retrievedData [][32]byte
	rows, err := models.DB.Raw("SELECT proof FROM `merkle_tree_sqls` WHERE address = ?", address).Rows()
	models.DB.Raw("SELECT * FROM `merkle_tree_sqls` WHERE address = ?", address).Find(&Data).Count(&count)
	if count > 0 {
		isTrue = true
	}
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		// 将查询结果转换为 []byte 类型
		if err := rows.Scan(&byteArray); err != nil {
			log.Fatal(err)
		}
		// 在这里处理读取到的 proof 数据
	}
	fmt.Println(byteArray)
	buf := *bytes.NewBuffer(byteArray)
	dec := gob.NewDecoder(&buf)
	if err := dec.Decode(&retrievedData); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("retrievedData: %v", retrievedData)
	fmt.Println()
	//bytes32Array := convertToBytes32Array(retrievedData)
	//
	//// 转换为链上的 bytes32[] 形式
	//bytes32String := "[" + strings.Join(bytes32Array, ", ") + "]"
	//
	//fmt.Printf("bytes32string:%v", bytes32String)
	//hexStrings := make([]string, len(retrievedData))
	//for i, b := range retrievedData1 {
	//	hexStrings[i] = "0x" + hex.EncodeToString(b)
	//}
	//fmt.Printf("hexStrings: %v", hexStrings)
	//fmt.Println()
	//hashSlice := convertToCommonHash(retrievedData)

	// 在这里使用 []common.Hash 切片
	//fmt.Printf("proof:%v", hashSlice)

	//for _, hash := range hashSlice {
	//	fmt.Println(hash.Hex())
	//}
	return
}
func convertToBytes32Array(data [][32]byte) []string {
	result := make([]string, len(data))
	for i, d := range data {
		result[i] = fmt.Sprintf("\"%x\"", d[:])
	}
	return result
}
func convertToCommonHash(slice [][32]byte) []common.Hash {
	result := make([]common.Hash, len(slice))
	for i, b := range slice {
		result[i] = common.BytesToHash(b[:])
	}
	return result
}
func uploadProofToContract(contract *bind.BoundContract, user string, data [][32]byte, index *big.Int, amount *big.Int, istrue bool, client *ethclient.Client) error {
	privateKey1 := strings.TrimPrefix(privateKey, "0x") // 去除私钥前缀 "0x"
	privateKeyBytes, err := crypto.HexToECDSA(privateKey1)
	var chainId *big.Int = big.NewInt(80001)

	auth, err := bind.NewKeyedTransactorWithChainID(privateKeyBytes, chainId)
	if err != nil {
		return err
	}
	//proof := common.LeftPadBytes([]byte(data), 32)
	//param := [32]byte{0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88}

	tx, err := contract.Transact(auth, "setProof", common.HexToAddress(user), data, index, amount, istrue)
	if err != nil {
		return err
	}

	// 等待交易确认
	a, err := bind.WaitMined(context.Background(), client, tx)
	fmt.Println(a)
	if err != nil {
		return err
	}

	return nil
}
func uploadDataToContract(contract *bind.BoundContract, user string, data *big.Int, client *ethclient.Client) error {
	privateKey1 := strings.TrimPrefix(privateKey, "0x") // 去除私钥前缀 "0x"
	privateKeyBytes, err := crypto.HexToECDSA(privateKey1)
	var chainId *big.Int = big.NewInt(80001)

	auth, err := bind.NewKeyedTransactorWithChainID(privateKeyBytes, chainId)
	if err != nil {
		return err
	}
	tx, err := contract.Transact(auth, "setPara", common.HexToAddress(user), data)
	if err != nil {
		return err
	}

	// 等待交易确认
	a, err := bind.WaitMined(context.Background(), client, tx)
	fmt.Println(a)
	if err != nil {
		return err
	}

	return nil
}
