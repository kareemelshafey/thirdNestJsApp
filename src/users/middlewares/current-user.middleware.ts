import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UsersService } from '../users.service'
import { User } from '../user.entity'

declare global {
    namespace Express {
        interface Request {
            // This will update to the namespace express library, interface request and add current user that may have a type of user
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private usersService: UsersService
    ) {} 

    async use(req: Request, res: Response, next: NextFunction){
        const { userId } = req.session || {};

        if(userId){
            const user = await this.usersService.findOne(userId);
            req.currentUser = user;
        }

        next();
    }
}