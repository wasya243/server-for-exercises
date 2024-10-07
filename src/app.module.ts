import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { ProductsModule } from './products.module';
import { UserModule } from './user.module';
import { InvoiceModule } from './invoice.module';
import { CarsModule } from './cars.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1/exercise-3-8'), UserModule, ProductsModule, InvoiceModule, CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
