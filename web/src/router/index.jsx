/*
 * @Author: diana
 * @Date: 2023-05-19 20:34:19
 * @LastEditTime: 2023-06-02 13:29:44
 */
// create创建path和组件的实例
// RouterProvider组件渲染传入实例
import { createBrowserRouter } from 'react-router-dom';

// 引入对应组件
import Login from '../components/Login';

// 主页及二级组件
import Home from '../pages/Home';
import Info from '../components/Info';
import Request from '../components/Request';
import Market from '../components/Market';
import Swap from '../components/Swap';
import Purchase from '../components/Sell';

import User from '../pages/User';
import Company from '../pages/Company';

import Admin from '../pages/Admin';
import PUser from '../components/AdminInfo/PUser';
import ACompany from '../components/AdminInfo/Company';
import Iprovider from '../components/AdminInfo/Iprovider';


import Provider from '../pages/IProvider';

// 生成实例
const router = createBrowserRouter([
    {
        path: '/',
        element: <Login/>,
    },
    {
        path: '/home',
        element:<Home/>,
        children: [
            {
                index:true,
                element: <Info />,
            },
            {
                path:'request',
                element: <Request />,
            },
            {
                path: 'swap',
                element: <Swap />,
            },
            {
                path: 'purchase',
                element: <Purchase />,
            }
        ]
    },
    {
        path: '/company',
        element:<Company/>,
        // children: [
        //     {
        //         index:true,
        //         element: <Company />,
        //     },
        //     {
        //         path: 'market',
        //         element: <Market />,
        //     },
        //     {
        //         path: 'swap',
        //         element: <Swap />,
        //     }
        // ]
    },
    {
        path: '/admin',
        element:<Admin/>,
        children:[
            {
                index:true,
                element:<PUser/>
            },
            {
                path:'company',
                element:<ACompany/>
            },
            {
                path:'provider',
                element:<Iprovider/>
            },
        ]
    },
    {
        path: '/provider',
        element:<Provider/>,
    },

])

export default router
