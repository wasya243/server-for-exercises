import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';

const pause = (ms: number) => {
  return new Promise((res) => {
      setTimeout(() => res(''), ms);
  });
};

const GAMES = [
  {
      name: 'COLD 4'
  },
  {
      name: 'Doom'
  },
  {
      name: 'Factorio'
  }
];

const USER_GRAPH_DATA = [
  {
      amountOfUsers: 10,
      date: '04-04-2024'
  },
  {
      amountOfUsers: 15,
      date: '04-05-2024'
  },
  {
      amountOfUsers: 25,
      date: '04-06-2024'
  },
  {
      amountOfUsers: 5,
      date: '04-07-2024'
  }
];

const SALES_GRAPH_DATA = [
  {
      salesAmount: 1000,
      date: '04-04-2024'
  },
  {
      salesAmount: 4000,
      date: '04-05-2024'
  },
  {
      salesAmount: 3500,
      date: '04-06-2024'
  },
  {
      salesAmount: 1300,
      date: '04-07-2024'
  }
];


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/contact-us')
  contactUs(@Body() body) {
    console.log('here', body);

    return 'ok';
  }

  @Get('/states')
  getStates() {
    return [
      {
        state: 'la',
        label: 'Los Angeles'
      }
    ]
  }

  @Get('/games')
  async getGames() {
    await pause(200);
    
    return GAMES;
  }

  @Get('/sales-graph')
  async getSalesGraph() {
    await pause(1500);

    return SALES_GRAPH_DATA;
  }

  @Get('/users-graph')
  async getUsersGraph() {
    await pause(3000);

    return USER_GRAPH_DATA;
  }

}
