/*
*

	@author: qianyi  2021/12/28 20:14:00
	@note:
*/
package models

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
	//err error
)

func Init() {

	dsn := "root:cuit@123456@tcp(139.9.249.149)/gva1?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: dsn,
	},
	), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	DB = db
}
