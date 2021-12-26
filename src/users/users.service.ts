import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string){
        const user = this.repo.create({ email, password });

        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOne({ id });
    }

    find(email: string) {
        return this.repo.find({ email })
    }

    // Partial user is a type helper that uses a part of the user entity to help in updating
    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('user not found')
        }
        // Object.assign takes everything in the attrs and overwrites it in the user 
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('user not found')
        }
        return this.repo.remove(user);
    }
}
