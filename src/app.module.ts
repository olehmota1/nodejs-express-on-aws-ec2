import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';

import { pinoLoggerConfig } from './config/logger.config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { typeOrmConfig } from './config/orm.config';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    LoggerModule.forRoot(pinoLoggerConfig),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MailModule,
    CompanyModule,
    UserModule,
    ProductModule,
    ProfileModule,
  ],
})
export class AppModule {}
