/*
 * @Author: diana
 * @Date: 2023-05-16 18:22:29
 * @LastEditTime: 2023-06-01 14:48:01
 */
import React, { useRef, useState, useContext } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Card } from 'antd';
import Highlighter from 'react-highlight-words';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent } from 'echarts/components';
import { TooltipComponent } from 'echarts/components';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MyContext } from '../../interact';
import { ethers } from 'ethers';
import AdminHeader from '../../components/AdminHeader';
import AdminNav from '../../components/AdminNav';
import Distribute from '../../components/Distribute';
import { Outlet } from 'react-router-dom';
// 合约信息
// const contractAddress = "";
// const abi = [];
echarts.use([TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]);

const option = {
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            data: [820, 932, 901, 934, 1290, 1330],
            type: 'line',
            name: '数据1',
        },
        {
            data: [620, 732, 701, 734, 1090, 1130],
            type: 'line',
            name: '数据2',
        },
    ],
};

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Joe Black',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Jim Green',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
];



export default function Admin(ethereum) {


    const { contracts } = useContext(MyContext);

    const distributeToken = async (account) => {
        try {
            const approve = await contracts[1].approve(contracts[1].address, 100000000)
            approve.wait();

            const RequestTx = await contracts[1].distributeTokens(
                account,
                100,
                { gasLimit: 500000 });
            RequestTx.wait();
            console.log(RequestTx)
        } catch (e) {
            console.log(e);
        }
    }



    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: '20%',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
    ];


    return (
        <>
        <div className='bg-buttonnormal'>
            <AdminHeader />

            <div className='bg-adminbg h-32 w-full flex flex-row items-end justify-center'>
                <h1 className='text-4xl text-white'>Welcome!My Dear Administor</h1>
            </div>
            <div className='bg-adminbg h-32 w-full flex flex-row items-start justify-center'>
                <h1 className='text-2xl text-white'>Welcome!My Dear Administor</h1>
            </div>
            <div className='bg-adminbg h-16 w-full flex flex-row items-center justify-center'>
                <div className='w-1/3 h-48 z-50 bg-white shadow  rounded-lg hover:-translate-y-2'>
                    <div className='ml-5 mt-7 flex flex-row'>
                        <svg className="arrow" width="50" height="50" viewBox="0 0 1024 1024">
                            <path d="M1022.517493 512.942488c0 281.360557-228.087085 509.452736-509.452737 509.452736s-509.452736-228.092179-509.452736-509.452736c0-281.365652 228.087085-509.452736 509.452736-509.452737s509.452736 228.087085 509.452737 509.452737" fill="#EF4084" p-id="5314"></path><path d="M470.82603 471.967204c53.013652-2.562547 103.169274-2.26197 152.535244-8.34993 32.258547-3.973731 48.168756-29.930348 48.000636-62.601553-0.163025-31.178507-16.312677-57.848358-46.548696-61.353393-50.812816-5.884179-102.328677-5.649831-153.987184-8.008597v140.313473zM226.365134 554.029851V470.540736h134.363065v-218.91184c9.068259-0.804935 15.548498-1.869692 22.028736-1.879881 81.446209-0.086607 162.892418-0.453413 244.333533 0.32605 19.333731 0.188498 39.064836 2.562547 57.873831 7.050826 61.210746 14.600915 96.373174 56.381134 99.674427 116.007482 3.413333 61.541891-24.652418 102.196219-86.250348 125.08593-1.528358 0.565493-2.832557 1.701572-7.05592 4.315065 5.069055 1.50798 8.227662 2.526886 11.437214 3.387861 56.090746 15.044139 88.354388 51.378308 95.889194 108.854766 7.050826 53.818587-19.797333 109.41007-71.053373 132.335443-33.236697 14.865831-70.900537 25.258667-107.086966 27.000995-82.103403 3.948259-164.522667 1.334766-246.814567 1.299104-3.209552 0-6.419104-0.886448-10.871721-1.543641v-147.221652h106.480716v65.719403c57.216637-2.664438 112.981333-1.467224 167.50806-9.134488 36.150766-5.084338 51.566806-37.582328 47.032677-76.1479-3.601831-30.643582-24.637134-50.374687-62.453811-50.924896-120.429532-1.757612-240.894726-1.569114-361.339543-2.119323-10.800398-0.050945-21.600796-0.010189-33.695204-0.010189z" fill="#FFFFFF" p-id="5315"></path>
                        </svg>
                        <p className='text-gray-400 mt-4 ml-4'>Carbon emission quotas</p>
                    </div>
                    <p className='text-gray-600 ml-4 mt-2'>
                        Carbon emission quotas will be distributed periodically (once a year), calculated periodically (every 3-4 months), and checked in real time.
                    </p>

                </div>
                <div className='w-1/3 h-48 z-50 bg-white border rounded-lg hover:-translate-y-2 ml-10'>
                    <div className='ml-5 mt-7 flex flex-row'>
                        <svg className="arrow" width="50" height="50" viewBox="0 0 1024 1024">
                            <path d="M356.352 625.152l27.648-14.848 106.496 59.904v-147.456l-21.504-10.752-106.496-61.952v121.344l-23.552 12.8-89.6-51.2-106.496 59.904V716.8l106.496 59.904L356.352 716.8v-91.648z m326.144-40.448l-21.504-12.8V450.048l-128 72.704v147.456l106.496-59.904 27.648 14.848V716.8l106.496 59.904 106.496-59.904v-123.904l-106.496-59.904-91.136 51.712z m0-384v98.304l113.152 61.952v111.104l10.752 6.144 74.752 42.496V309.248l-198.656-108.544z m-64 561.152L512 819.2l-106.496-57.344-16.896 10.752-70.144 38.4 194.048 106.496 194.048-106.496-70.656-38.4-17.408-10.752zM228.352 471.552V360.448l113.152-61.952V200.704L142.848 309.248v210.944l74.752-42.496 10.752-6.144zM384 413.696L512 486.4l21.504-12.8L640 413.696l-106.496-59.904v-14.848l85.504-49.152V168.448L512 106.496 405.504 168.448v121.344l85.504 49.152v14.848L384 413.696z" fill="#FF6A00" p-id="6451"></path>
                        </svg>
                        <p className='text-gray-400 mt-4 ml-4'>Punishment mechanisms:</p>
                    </div>
                    <p className='text-gray-600 ml-4 mt-2'>
                        If the usage exceeds the quota limit after calculation. The debt will be added to the usage for each subsequent calculation, and phased measures will be taken.
                    </p>


                </div>

            </div>

            <AdminNav />

            <Outlet/>


            <div className='mt-50'>
                <Distribute />
            </div>


            <div className='flex flex-row bg-gradient-to-b from-lime-500 items-center w-full h-56'>

                <div className="ml-10 h-48 w-1/5  stat  bg-gray-100 border border-gray-300 hover:border-gray-500 rounded-lg">
                    <div className="stat-title">All Users</div>
                    <div className="stat-value text-primary">2000</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>

                <div className="ml-10 h-48 w-1/5 stat bg-gray-100 border-t-4 border-pink-600 rounded-lg">
                    <div className="stat-title">CT Used</div>
                    <div className="stat-value  text-secondary">1500</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>

                <div className="ml-10 h-48 w-1/5  stat bg-gray-100 border-t-4 border-orange-300  rounded-lg">
                    <div className="stat-title">CT remain</div>
                    <div className="stat-value text-primary">500</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>

                <div className="ml-10 h-48 w-1/5  stat bg-gray-100 border-t-4 border-blue-500 rounded-lg">
                    <div className="stat-title">All Users</div>
                    <div className="stat-value text-primary">2000</div>
                    <div className="stat-desc">21% more than last month</div>
                </div>
            </div>

            <div className='flex flex-row bg-gray-100 px-2 py-2  px-8 py-5'>
                {/* <div className='bg-white h-screen'>
                    <div className='w-full h-20 bg-titlebg text-4xl text-white  flex items-center px-5'>
                        历史交易记录
                    </div>

                    <div className='px-2 py-2'>
                        <Table columns={columns} dataSource={data} />
                    </div>

                </div> */}
                <Card
                    title="Card title"
                    bordered={false}
                    className='w-1/3 h-72'
                >
                    {/* 折线图 */}
                    <div className='-mt-20'>
                        <ReactEchartsCore className='mt-5' echarts={echarts} option={option} />
                    </div>
                </Card>

                <Card
                    title="Card title"
                    bordered={false}
                    className='ml-3 w-1/3 h-72'
                >
                    {/* 折线图 */}
                    <div className='-mt-20'>
                        <ReactEchartsCore className='mt-5' echarts={echarts} option={option} />
                    </div>
                </Card>

                <Card
                    title="Card title"
                    bordered={false}
                    className='ml-3 w-1/3 h-72'
                >
                    {/* 折线图 */}
                    <div className='-mt-20'>
                        <ReactEchartsCore className='mt-5' echarts={echarts} option={option} />
                    </div>
                </Card>


            </div>

            <div className='flex flex-row bg-gray-100 px-2 py-2 px-8 py-5'>
                <div className='w-full'>
                    <Table columns={columns} dataSource={data} />
                </div>

                {/* <div className='w-1/2 mr-10'>
                <Table columns={columns} dataSource={data} />
                </div> */}
            </div>
</div>
        </>
    )
}

