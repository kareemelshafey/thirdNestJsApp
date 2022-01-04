import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
    app.use(cookieSession({
        keys: ['asdfasfd'],
        }),
      );
      app.useGlobalPipes(
        new ValidationPipe({
          // used to make user only add to the fields they are allowed to add to, so it is a security thing :D 
          whitelist: true
        })
      )
}