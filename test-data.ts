export type Credentials ={
    email:string;
    password:string;
    role?:string;
};

export const validUser = {
    email: "user1email@gmail.com",
    password: "1234567890",
};

export function getLoginURL(env: string): string {
    return `https://${env}.example.com/login`;
};