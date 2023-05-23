package main

import (
	"Server/mod/models"
	"bytes"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	distributor "github.com/fachebot/merkle-distributor"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"math/big"
)

func main() {
	dsn := "root:cuit@123456@tcp(139.9.249.149)/gva1?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: dsn,
	},
	), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	balances := []distributor.Balance{
		{Account: common.HexToAddress("0x243749Bf42346bB9A122034E81281819AA2CFbb6"), Amount: big.NewInt(100)},
		{Account: common.HexToAddress("0x63FC2aD3d021a4D7e64323529a55a9442C444dA0"), Amount: big.NewInt(100)},
		{Account: common.HexToAddress("0xD1D84F0e28D6fedF03c73151f98dF95139700aa7"), Amount: big.NewInt(100)},
		{Account: common.HexToAddress("0xD1D84F0e28D6fedF03c73151f98dF95139700a11"), Amount: big.NewInt(100)},
	}
	err = db.AutoMigrate(&models.MerkleTreeSql{})
	if err != nil {
		fmt.Println("Failed to create table:", err)
		return
	}
	info, err := distributor.ParseBalanceMap(balances)
	if err != nil {
		panic(err)
	}
	data, err := json.Marshal(info)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(data))
	fmt.Println("root:")
	fmt.Println(info.MerkleRoot)
	for k, v := range info.Claims {
		//strings1 := make([]string, len(v.Proof))
		//for i, h := range v.Proof {
		//	strings1[i] = fmt.Sprintf(`"%s"`, h.String())
		//}
		//// 使用逗号将字符串切片连接为一个字符串
		//result := fmt.Sprintf("[%s]", strings.Join(strings1, ","))
		var buf bytes.Buffer
		enc := gob.NewEncoder(&buf)
		if err := enc.Encode(v.Proof); err != nil {
			log.Fatal(err)
		}
		byteArray := buf.Bytes()

		mdata := models.MerkleTreeSql{
			Address: balances[k].Account.Hex(),
			Amount:  balances[k].Amount.Int64(),
			Proof:   byteArray,
			Root:    info.MerkleRoot.Hex(),
		}

		// 插入数据
		err = db.Create(&mdata).Error
		if err != nil {
			fmt.Println("Failed to insert data:", err)
			return
		}
		fmt.Printf("地址为:%v  proof为 %v", balances[k].Account, byteArray)
		fmt.Println()
	}

}
