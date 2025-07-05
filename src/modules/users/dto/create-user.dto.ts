import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty({message: 'Name is required'})
    name: string;

    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be a valid email address'})
    email: string;
    
    @IsNotEmpty({message: 'Password is required'})
    password: string;
    
    phone: string;
    address: string;
    image: string;

}
