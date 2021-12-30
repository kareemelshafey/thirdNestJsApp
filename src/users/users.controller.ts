import { Body, Controller, Post, Get, Delete, Patch, Param, Query, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from './user.entity'
import { AuthGaurd } from '../gaurds/auth.gaurd'

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
        ){}

    // @Get('/whoami')
    // whoAmI(@Session() session: any){
    //     return this.usersService.findOne(session.userId);
    // }    

    @Get('/whoami')
    @UseGuards(AuthGaurd)
    whoAmI(@CurrentUser() user: User){
        return user;
    }    

    @Post('signout')
    signOut(@Session() session: any){
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: createUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        // If the session is updated at the same time then this means that the cookie will be the same because it is the same session
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: createUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    // id is defined as a string not  a number as it is a part of the url and every part of the url is defined as a string
    @Get('/:id')
    async findUser(@Param('id') id: string){
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: updateUserDto){
        return this.usersService.update(parseInt(id), body);
    }
}
