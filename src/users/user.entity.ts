import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    // Hooks only work when entity is created and here is for exaple why we create then save
    // this is used after the user is inserted into the database
    @AfterInsert()
    logInsert(){
        console.log("Inserted User with id", this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log("Updated User with id", this.id);
    }

    @AfterRemove()
    logRemove(){
        console.log("Removed User with id", this.id);
    }
}