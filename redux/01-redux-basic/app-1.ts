import { Action } from "./ngrx-fake/ngrx";


const incrementAction:Action = {
    type: "INCREMENT"
}
const decrementAction:Action = {
    type: "DECREMENT"
}

interface ActionManager {
    INCREMENT: (oldState:any)=>{},
    DECREMENT:(oldState:any)=>{}
}
const actionManager:ActionManager = {
    INCREMENT : (oldState:any)=> increment(oldState),
    DECREMENT : (oldState:any)=>decrement(oldState)
}
function increment(oldState:any){
    return oldState+1;
}
function decrement(oldState:any){
    return oldState-1;
}


//Un reducer siempre tiene que tener dos parámetros, el oldState y la Action
//Siempre devuelve un newState
function reducer(oldState = 10, action:Action){
    const type = action.type as keyof ActionManager;

    if(typeof  actionManager[type] === "function" ){
        return actionManager[type](oldState)
    }
    return oldState;
}

//Usar el reducer

console.log(reducer(10, decrementAction));