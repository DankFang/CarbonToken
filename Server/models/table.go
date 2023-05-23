package models

import (
	"github.com/ethereum/go-ethereum/common"
	"math/big"
)

type Company struct {
	ID         uint   `json:"ID" gorm:"id"`
	Name       string `json:"Name" gorm:"name"`
	Type       int    `json:"Type" gorm:"type"`
	Efficiency int    `json:"Efficiency" gorm:"efficiency"`
	Address    string `json:"Address" gorm:"address"`
}

func (Company) TableName() string {
	return "a_companydetail"
}

type MerkleTreeSql struct {
	Id      int    `gorm:"id"`
	Address string `gorm:"address"`
	Amount  int64  `gorm:"amount"`
	Proof   []byte `gorm:"proof"`
	Root    string `gorm:"root"`
}
type Balance struct {
	Account common.Address
	Amount  *big.Int
}

type Manage struct {
	Id      uint   `gorm:"id"`
	Address string `gorm:"address"`
	Desc    string `gorm:"desc"`
}

func (Manage) TableName() string {
	return "a_manage"
}

type Admin struct {
	Id      uint   `gorm:"id"`
	Address string `gorm:"address"`
	Desc    string `gorm:"desc"`
}

func (Admin) TableName() string {
	return "a_admin"
}
