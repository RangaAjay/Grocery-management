import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order.items.entity';
import { OrderModule } from './order/order.module';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
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
        entities: [User, Product, Order, OrderItem],
        synchronize: true,
        logging: true,
      }),
    }),
    UserModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
