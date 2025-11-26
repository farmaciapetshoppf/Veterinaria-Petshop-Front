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