import { actions } from "../auth"

export function setUser(rawData){
    console.log("___Raw___Data____")
    let { user } = rawData 
    let {avatar} = user
    user ={
        name : user.name,
        email: user.email,
        profilepic : avatar.url
    }

    return user
}

export function handleLoginErrorGlobal(loginerror,dispatch){
    console.log("_____login___ERror hanler_____")
    console.log(loginerror)
    if(loginerror === "forgotten password ?"){
        dispatch(actions.notAUser("forgot"))
    }else if (loginerror ==="user donot exist sign up"){
        return "signup"
    }

}