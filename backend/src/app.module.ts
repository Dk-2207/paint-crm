import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, CustomersModule, ProductsModule, InvoicesModule, DashboardModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}