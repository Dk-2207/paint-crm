import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [totalCustomers, invoices, recentInvoices] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.invoice.findMany({ select: { total: true } }),
      this.prisma.invoice.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: true },
      }),
    ]);

    const totalSales = invoices.reduce((sum, inv) => sum + Number(inv.total), 0);

    return {
      totalCustomers,
      totalSales,
      totalInvoices: invoices.length,
      recentInvoices,
    };
  }
}