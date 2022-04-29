export interface IUser {
    name: string,
    email: string,
    password: string,
    age: number,
    katas: string[]
}

export interface IUserUpdate {
    name: string,
    age: number
}