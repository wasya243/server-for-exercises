import { Controller, Delete, Param, Body, Post, Put } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('/create')
  createCar(@Body() body: any) {
    const createData = { amount: body.amount, description: body.description, price: body.price, name: body.name };
    return this.carsService.create(createData);
  }

  @Post()
  getCars(@Body() body: any) {
    const pagination = {
      page: parseInt(body.pagination.page, 10) || 0,
      perPage: parseInt(body.pagination.rowsPerPage, 10) || 10,
    };
    const sort = body.sort;
    const filters = body.filters;

    return this.carsService.findAll({ pagination, sort, filters });
  }

  @Put('/:id')
  updateCar(@Body() body: any, @Param() params: any) {
    const id = params.id;
    const update = { amount: body.amount, description: body.description, price: body.price, name: body.name };

    return this.carsService.update(id, update);
  }

  @Delete('/:id')
  deleteCar(@Param() params: any) {
    console.log('here-delete', params.id);
    return this.carsService.delete(params.id);
  }
}