import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'

describe('AuthService', () => {

    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        // Create a fake copy of the users service 
        // Partial means that it checks if the types is correct
        const users: User[] = [];
         fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => { 
                const user = { id: Math.floor(Math.random() * 999999), email, password} as User;
                users.push(user);
                return Promise.resolve(user);
            },
        }
        
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    // This means that the useValue is given instead of the provide
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com','asdf');
        
        expect(user.password).not.toEqual('asdf');
        const [salt,hash] = user.password.split('.')
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        try {
            await service.signup('asdaaaf@asdf.com', 'asdf');
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException)
            expect(err.message).toBe('email in use');
        }
    })

    it('throws if sign in is called with an unused email', async () => {
        try {
            await service.signin('asdasasf@asdf.com', 'asdf')
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException)
            expect(err.message).toBe('user not found');
        }
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('lalalsmak@nsnkdaaa.com', 'password');
        let user;
        try {
            user = await service.signin('lalalsmak@nsnkdaaa.com', 'ppassword');
            expect(user).not.toBeDefined();
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException)
            expect(err.message).toBe('bad password');
        }
    })

    it('returns a user if correct password is provided', async () => {
        await service.signup('asdf@asdf.com', 'mypassword');

        const user = await service.signin('asdf@asdf.com', 'mypassword')
        expect(user).toBeDefined();
    })
})

