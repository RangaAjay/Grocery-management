import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '../.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('database').databaseType,
        host: configService.get('database').dbHostname,
        port: configService.get('database').databasePort,
        database: configService.get('database').databaseName,
        password: configService.get('database').databasePassword,
        username: configService.get('database').databaseUsername,
        entities: [User],
        synchronize: true,
        logging: true,
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
