import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity'
import { Report } from './reports/report.entity'

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    // name of the database and creates a new file in our project automatically
    database: 'db.sqlite', 
    // entities we have through the app
    entities: [User, Report],
    // synchronize to automatically change the structure of the dataset, used only in development as it may delete columns
    synchronize: true
  }),
  UsersModule,
  ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
