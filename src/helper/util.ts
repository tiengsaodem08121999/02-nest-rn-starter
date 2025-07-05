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
