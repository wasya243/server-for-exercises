import { Controller, Delete, Param, Body, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  getUsers(@Body() body: any) {
    const pagination = {
      page: parseInt(body.pagination.page, 10) || 0,
      perPage: parseInt(body.pagination.rowsPerPage, 10) || 10,
    };
    const sort = body.sort;
    const filters = body.filters;

    return this.userService.findAll({ pagination, sort, filters });
  }

  @Put('/:id')
  updateUser(@Body() body: any, @Param() params: any) {
    const id = params.id;
    const update = { firstName: body.firstName, lastName: body.lastName, email: body.email, salary: body.salary };

    return this.userService.update(id, update);
  }

  @Delete('/:id')
  deleteUser(@Param() params: any) {
    return this.userService.delete(params.id);
  }
}