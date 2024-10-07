import { Controller, Delete, Param, Body, Post, Put } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  getInvoices(@Body() body: any) {
    const pagination = {
      page: parseInt(body.pagination.page, 10) || 0,
      perPage: parseInt(body.pagination.rowsPerPage, 10) || 10,
    };
    const sort = body.sort;
    const filters = body.filters;

    return this.invoiceService.findAll({ pagination, sort, filters });
  }

  @Put('/:id')
  updateInvoice(@Body() body: any, @Param() params: any) {
    const id = params.id;
    const update = { description: body.description, amount: body.amount };

    return this.invoiceService.update(id, update);
  }

  @Delete('/:id')
  deleteInvoice(@Param() params: any) {
    return this.invoiceService.delete(params.id);
  }
}