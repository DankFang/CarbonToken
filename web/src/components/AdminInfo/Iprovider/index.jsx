/*
 * @Author: diana
 * @Date: 2023-05-27 16:34:38
 * @LastEditTime: 2023-06-02 19:53:45
 */
/*
 * @Author: diana
 * @Date: 2023-05-27 16:34:38
 * @LastEditTime: 2023-06-01 12:55:31
 */
import React, { useState, useEffect, useContext } from 'react';
import { Form, Radio, Space, Switch, Table, Button, Tag, Modal } from 'antd';
import { MyContext } from '../../../interact';
import { ethers } from 'ethers';



const Iprovider = () => {

    const { contracts } = useContext(MyContext);

    const [address, setAddress] = useState(null);


    const columns = [
        // 序号
        {
            title: 'Order',
            dataIndex: 'order',
            key: 'order',
            render: (text) => <a>{text}</a>,
        },

        // 地址
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Type',
            key: 'tags',
            dataIndex: 'tags',
            render:
                (_, { tags }) => (
                    <>
                        {tags.map((tag) => {
                            let color = tag === "ICB" ? 'green' : 'pink';
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </>
                ),
        },
        {
            title: 'AddProvider',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => handleButtonICB(record)}>ADD ICB</Button>
                    <Button onClick={() => handleButtonTAX(record)}>ADD TAX</Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            order:1,
            address:'0x4980841b9DfB43612f788AeB02d333c3BE48C92E',
            tags:['ICB']
        },
        {
            order:2,
            address:'0xec9b7B03A291702a145BD403804C98A375CA48A8',
            tags:['TAX']
        }
    ]

     // 点击行内按钮的回调函数
     const handleButtonICB = async (rowData) => {
        try{
            const tx = await contracts[8].setICB(rowData.address)
            tx.wait();
        }catch(e){
            console.log(e);
        }

    }

    // 点击行内按钮的回调函数
    const handleButtonTAX = async (rowData) => {
        try{
            const tx = await contracts[8].setTAX(rowData.address)
            tx.wait();
        }catch(e){
            console.log(e);
        }
    }



    return (
        <>
            <div className='flex flex-col items-center justify-center w-full min-h-screen px-2 rounded-lg -mt-10'>
                {/* 表格 */}
                <div className='w-3/4 border border-gray-300 rounded-lg flex flex-row bg-white'>
                    <div className='w-full h-full'>
                        <div className='px-2'>
                            <Table columns={columns} dataSource={data} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Iprovider;