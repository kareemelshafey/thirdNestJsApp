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
         fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password} as User),
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
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1'} as User]);

        try {
            await service.signup('asdf@asdf.com', 'asdf')
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException)
            expect(err.message).toBe('email in use');
        }
    })

    it('throws if sign in is called with an unused email', async () => {
        try {
            await service.signin('asdf@asdf.com', 'asdf')
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException)
            expect(err.message).toBe('user not found');
        }
    });

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{  email: 'asdf@asdf.com', password: 'laskdjf'} as User]);
        try {
            await service.signin('lalalsmak@nsnkda.com', 'password')
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException)
            expect(err.message).toBe('bad password');
        }
    })

    it('returns a user if correct password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{  email: 'asdf@asdf.com', password: '1e3736f8abb249af.f76667abe905828d139e6bea0624886aadac0465be7033ec7526ba4de46f932e'} as User]);

        const user = await service.signin('asdf@asdf.com', 'mypassword')
        expect(user).toBeDefined();

        // const user = await service.signup('asdf@asdf.com', 'mypassword')
        // console.log(user)
    })
})

