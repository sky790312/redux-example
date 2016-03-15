import Redux, { createStore, combineReducers, applyMiddleware } from 'redux';
// createStore => 這邊用於產生 middleware 的 store
// combineReducers => 合併 reducers
// applyMiddleware => Middleware 處理非同步ex: ajax

let button = document.getElementById('mybutton');
let button2 = document.getElementById('mybutton2');
let button3 = document.getElementById('mybutton3');
let text = document.getElementById('count');

//=========action part - 分離至ex: actions/count.js =============//

const CLICKEVENT = 'CLICKEVENT';
function clickAction(count = 1, delay = 0) {
    return{
        type: CLICKEVENT,
        count,
        delay
    };
}

//========= middleware part 分離至ex: middleware.js =============//

// var inc = (x) => x+1;
// equal to
// var inc = function (x) { return x + 1; };
const myDelayMiddleware = store => next => action => {
    if (action.delay) {
        return setTimeout(() => {
            next(action);
        }, action.delay * 1000);
    } else {
        next(action);
    }
}

//========= reducer part - 分離至ex: reducers/countReducer.js =============//

let initialState = {
    clickCount: 0
};
function myClickReducer (state = initialState, action) {
    switch (action.type) {
        case CLICKEVENT:
            state.clickCount += action.count;
            // 展開運算子(Spread Operator)與其餘參數(Rest parameters)
            return { ...state };
        default:
            return state;
    }
}

//========= store part =============//

// deal with middleware
let createStoreWithMiddleware = applyMiddleware(myDelayMiddleware)(createStore);
// 合併 reducers
let myReducers = combineReducers({
    myClickState: myClickReducer
});
// 最後合併 widdleware & reducers
let store = createStoreWithMiddleware(myReducers);

//========= view part 分離至ex: 結合react(Provider) - xxx.jsx =============//

// dispatch - action
button.addEventListener('click', () => {
    store.dispatch(clickAction())
});
button2.addEventListener('click',() => {
    store.dispatch(clickAction(10));
});
button3.addEventListener('click',() => {
    store.dispatch(clickAction(5, 2));
})

// view - getState
store.subscribe(function(){
    text.textContent = store.getState().myClickState.clickCount
})
