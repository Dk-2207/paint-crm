import { IsInt, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemInput {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateInvoiceDto {
  @IsInt()
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemInput)
  items: InvoiceItemInput[];
}