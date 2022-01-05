import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity'
import { Report } from './reports/report.entity'
// The config module is used to specify which file we are going to read while the configservice will be used to read the data inside the file. 
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report]
        }
      }
    }),
  //   TypeOrmModule.forRoot({
  //   type: 'sqlite',
  //   // name of the database and creates a new file in our project automatically
  //   database: 'db.sqlite', 
  //   // entities we have through the app
  //   entities: [User, Report],
  //   // synchronize to automatically change the structure of the dataset, used only in development as it may delete columns
  //   synchronize: true
  // }),
  UsersModule,
  ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // used to make user only add to the fields they are allowed to add to, so it is a security thing :D 
        whitelist: true
      })
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieSession({
      keys: ['asdfasfd'],
      }),
      // * means all routes
    ).forRoutes('*');
  }
}
