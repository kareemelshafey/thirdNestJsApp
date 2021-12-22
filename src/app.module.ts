import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity'

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    // name of the database and creates a new file in our project automatically
    database: 'db.sqlite', 
    // entities we have through the app
    entities: [User],
    synchronize: true
  }),
  UsersModule,
  ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
