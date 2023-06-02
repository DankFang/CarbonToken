/*
 * @Author: diana
 * @Date: 2023-05-22 14:36:38
 * @LastEditTime: 2023-05-31 14:02:05
 */


const initState = {
    currentAccount:'',
    userType:'',
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case 'send_type':
            console.log(3)
            // 匹配上了就把action和state组合成新对象返回
            return {
                ...state,
                currentAccount:action.currentAccount,
                userType:action.userType,
            }
        default:
            return state;
    }
};

export default reducer;