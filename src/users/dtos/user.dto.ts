import { Expose } from 'class-transformer'

export class UserDto {
// Expose means share this field
    @Expose()
    id: number;

    @Expose()
    email: string;
}