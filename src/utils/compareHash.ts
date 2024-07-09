import bcrypt from 'bcryptjs';

export const compareHash = (text:string,hash:string)=>{
    return bcrypt.compareSync(text,hash);
}