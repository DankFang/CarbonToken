/*
 * @Author: diana
 * @Date: 2023-05-16 18:46:44
 * @LastEditTime: 2023-06-01 20:59:13
 */
// https://app.uniswap.org/#/nfts
// 表格，当前交易
import React, { useEffect, useState, useContext } from 'react';

import { ethers } from 'ethers';

import { Table, Tag, Space, Button, Modal, Input } from 'antd';
import qs from 'qs';
import { MyContext } from '../../interact'
import { useSelector } from 'react-redux';



export default function Market() {

    const currentAccount = useSelector(state => state.currentAccount);

    // 弹出框 anti-design
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const { contracts } = useContext(MyContext);
    // 数据
    const [data, setData] = useState();

    const [selectedRowData, setSelectedRowData] = useState(null);
    const [purchaseAmount, setpurchaseAmount] = useState();


    const getData = async () => {

        try {
            // 待改
            const Data = await contracts[5].getAllOrders();
            const orders = Data.map(data => {
                return {
                    orderId: Number(data[0].toString()) + 1,
                    // 数量
                    purchaseLimit: Number(data[1]),
                    // 价格
                    price: Number(data[2].toString()),
                    // 剩余收购量
                    remainingQuantity: data[3].toString(),
                    // 状态
                    tags: data[4] === true ? ['Sold out'] : ['On Sell'],
                    // 订单创建者地址
                    merchant: data[5]
                }
            })
            setData(orders);
            console.log("this is market data:", data);

        } catch (e) {
            console.log(e)
        }
    }

    // 选中数字
    const chooseAmount = (e) => {
        const { value } = e.target;
        setpurchaseAmount(value);
    }

    // 下单
    const placeOrder = async () => {
        console.log(typeof selectedRowData.orderId, typeof parseInt(purchaseAmount))

        await contracts[1].approve(contracts[5].address, 100000)
        const tx = await contracts[5].placeOrder(
            selectedRowData.orderId - 1,
            parseInt(purchaseAmount),
            {
                value: ethers.utils.parseEther("0.0001"),
                gasLimit: 4000000
            })
        await tx.wait()
        getData();
        // const tx = await contracts[5].placeOrder(
        //     selectedRowData.orderId-1,
        //     parseInt(purchaseAmount),
        //     {
        //         value: ethers.utils.parseEther("0.0001"),
        //         gasLimit:4000000}
        //     );
        // tx.wait();
        console.log("this is tx data", tx)

    }

    // 点击行内按钮的回调函数
    const handleButtonClicked = (rowData) => {
        // 将选中的行数据保存到state中
        setSelectedRowData(rowData);
        setIsModalOpen(true);
        console.log(selectedRowData, "this is selected")
    }

    const columns = [
        // id
        {
            title: 'Id',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text) => <a>{text}</a>,
        },
        // 公司地址
        {
            title: 'Company',
            dataIndex: 'merchant',
            key: 'merchant',
        },
        // 交易状态
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render:
                (_, { tags }) => (
                    <>
                        {tags.map((tag) => {
                            let color = tag === "On Sell" ? 'green' : 'red';
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </>
                ),
        },
        // 数量
        {
            title: 'PurchaseLimit',
            dataIndex: 'purchaseLimit',
            key: 'purchaseLimit',
        },
        // 价格
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        // 剩余收购量
        {
            title: 'RemainingQuantity',
            dataIndex: 'remainingQuantity',
            key: 'remainingQuantity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleButtonClicked(record)}>Purchase</Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <div className='flex flex-col '>
                {/* 交易市场 */}
                <div className='px-6'>
                    <Table columns={columns} dataSource={data} />
                </div>

                <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
                    <div
                        className="mb-0 mt-6 space-y-4 p-4  sm:p-6 lg:p-8"
                    >
                        <h1 className="text-start text-2xl font-bold text-indigo-600 sm:text-3xl mb-10">
                            Amount you want
                        </h1>

                        <div className='w-full mb-10 h-10'>
                            <Input type="number" style={{
                                width: '100%',
                                height: '100%',
                            }} min={1} value={purchaseAmount} onChange={chooseAmount} />
                        </div>

                        <button
                            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white mt-10"
                            onClick={placeOrder}  >
                            Place Order
                        </button>

                    </div>
                </Modal>

            </div></>
    )

};


