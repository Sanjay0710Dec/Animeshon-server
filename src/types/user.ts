import { JwtPayload } from "jsonwebtoken"



export interface SignupBody{
    username:string,
    email:string,
    password:string
}



export type SigninBody = Omit<SignupBody, "username">

export type ResetBody = Omit<SigninBody, "password">


export interface CustomJwtBody extends JwtPayload{
    userId:string
}






