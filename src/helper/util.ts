const bcrypt = require('bcrypt');

const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        if (!plainPassword) {
            throw new Error('Password is required');
        }
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.log('Error in hashPassword:', error);
    }
}   

export const comparePasswordHelper = async (plainPassword: string, hashedPassword: string) => {
    try {
        if (!plainPassword || !hashedPassword) {
            throw new Error('Both plain and hashed passwords are required');
        }
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.log('Error in comparePassword:', error);
    }
}