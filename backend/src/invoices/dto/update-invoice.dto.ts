import { IsOptional, IsString } from 'class-validator';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  status?: string;
}