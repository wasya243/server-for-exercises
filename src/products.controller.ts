import { Controller, Delete, Param, Body, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/create')
  createProduct(@Body() body: any) {
    const createData = { amount: body.amount, description: body.description, price: body.price, name: body.name };
    return this.productsService.create(createData);
  }

  @Post()
  getProducts(@Body() body: any) {
    console.log('here-body', body);
    const pagination = {
      page: parseInt(body.pagination.page, 10) || 0,
      perPage: parseInt(body.pagination.rowsPerPage, 10) || 10,
    };
    const sort = body.sort;
    const filters = body.filters;

    return this.productsService.findAll({ pagination, sort, filters });
  }

  @Put('/:id')
  updateProduct(@Body() body: any, @Param() params: any) {
    const id = params.id;
    const update = { amount: body.amount, description: body.description, price: body.price, name: body.name };

    return this.productsService.update(id, update);
  }

  @Delete('/:id')
  deleteProduct(@Param() params: any) {
    console.log('here-delete', params.id);
    return this.productsService.delete(params.id);
  }
}