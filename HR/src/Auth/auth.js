import { jwtDecode } from "jwt-decode";

export const logout =()=>{
    localStorage.removeItem("token");
    window.location.href="/login";
}

export const startToken = (token)=>{

    try{

        const decode = jwtDecode(token);
        const expirationTime = decode.exp * 1000;
        const timeRemaining = expirationTime - Date.now();
        if(timeRemaining <= 0){
            logout();
            return;
        }
        setTimeout(()=>{
            logout();
        },timeRemaining);


    }catch(error){
         console.error("Invalid token:", error);

        logout();
    }
}