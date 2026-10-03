import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { customerId, items } = createInvoiceDto;

    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    let subtotal = 0;
    const itemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      const price = Number(product.pricePerUnit);
      subtotal += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: price,
      };
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    return this.prisma.invoice.create({
      data: {
        customerId,
        subtotal,
        tax,
        total,
        items: {
          create: itemsData,
        },
      },
      include: {
        items: { include: { product: true } },
        customer: true,
      },
    });
  }

  findAll() {
    return this.prisma.invoice.findMany({
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
      },
    });
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: updateInvoiceDto.status,
      },
    });
  }

  remove(id: number) {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}