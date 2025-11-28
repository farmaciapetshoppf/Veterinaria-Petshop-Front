export interface IUserSession {
    token:string,
    user:IUser
}

interface IUser {
    id:number,
    name: string;
    email:string;
    address: string;
    phone:string;
}

export interface ILoginProps{
  email:string
  password:string
}

export interface IRegister {
    name: string;
    email:string;
    user:string;
    password: string;
    phone:string;
    country:string;
    city:string;
    address: string;
}