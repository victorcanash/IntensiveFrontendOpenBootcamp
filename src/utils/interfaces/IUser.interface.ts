export interface IUser {
    _id: string,
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