import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
// randomBytes bytes is used to generate the salt string
// scrypt will be responsible for the hashing function
import { randomBytes, scrypt as _scrypt } from 'crypto';
// promisify makes use of promises
import { promisify } from 'util'

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // 1 Check is the email is in use
        const users = await this.usersService.find(email);

        if(users.length){
            throw new BadRequestException('email in use');
        }

        // 2 Hash the user password
            // 2(A) Generate a salt 
        const salt = randomBytes(8).toString('hex')

            // 2(B) Hash the salt and the password
        const hash = (await scrypt(password, salt, 32)) as Buffer;

            // Joi the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // 3 Create a new user and save it 
        const user = await this.usersService.create(email,result);

        // 4 return the user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if(!user) {
            throw new NotFoundException('user not found')
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await scrypt(password, salt, 32) as Buffer;

        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        } 

        return user;
    }
}