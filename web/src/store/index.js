/*
 * @Author: diana
 * @Date: 2023-05-22 14:44:02
 * @LastEditTime: 2023-05-22 23:57:08
 */
import {createStore} from 'redux';

// 导入reducer，处理action
import reducer from '../reducer';

// 构建store
const store = createStore(reducer);

export default store;