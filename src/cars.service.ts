import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Car } from './cars.schema';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carsModel: Model<Car>) {}

  async findAll({ pagination, sort, filters }: { pagination: any, sort: any, filters: any }): Promise<{
    total: number,
    cars: Car[],
  }> {
    let mongoFilters = {};
    if (!_.isEmpty(filters)) {
      if(filters.priceTo && !filters.priceFrom) {
        mongoFilters['price'] = {
            $lte: filters.priceTo
        };
      } else if (filters.priceFrom && !filters.priceTo) {
        mongoFilters['price'] = {
            $gte: filters.priceFrom
        };
      } else if (filters.priceTo && filters.priceFrom) {
        if (!mongoFilters['$and']) mongoFilters['$and'] = [];

        mongoFilters['$and'].push({
            price: {
                $gte: filters.priceFrom
            }
        });
        mongoFilters['$and'].push({
            price: {
                $lte: filters.priceTo
            }
        });
      }

      if(filters.amountTo && !filters.amountFrom) {
        mongoFilters['amount'] = {
            $lte: filters.amountTo
        };
      } else if (filters.amountFrom && !filters.amountTo) {
        mongoFilters['amount'] = {
            $gte: filters.amountFrom
        };
      } else if (filters.amountFrom && filters.amountTo) {
        if (!mongoFilters['$and']) mongoFilters['$and'] = [];

        mongoFilters['$and'].push({
            amount: {
                $gte: filters.amountFrom
              }
        });
        mongoFilters['$and'].push({
            amount: {
                $lte: filters.amountTo
            }
        });
      }

      if(filters.engineTo && !filters.engineFrom) {
        mongoFilters['amount'] = {
            $lte: filters.engineTo
        };
      } else if (filters.engineFrom && !filters.engineTo) {
        mongoFilters['amount'] = {
            $gte: filters.engineFrom
        };
      } else if (filters.engineFrom && filters.engineTo) {
        if (!mongoFilters['$and']) mongoFilters['$and'] = [];

        mongoFilters['$and'].push({
            amount: {
                $gte: filters.engineFrom
              }
        });
        mongoFilters['$and'].push({
            amount: {
                $lte: filters.engineTo
            }
        });
      }
    }

    const query = this.carsModel
      .find(mongoFilters)
      .skip(pagination.page * pagination.perPage)
      .limit(pagination.perPage);

    let mongoSort;
    if (!_.isEmpty(sort)) {
      mongoSort = Object
        .keys(sort)
        .filter(key => sort[key])
        .reduce((ac, cv) => { 
          ac[cv] = sort[cv] === 'asc' ? 1 : -1; 
          return ac; 
        }, {});
    }

    if (mongoSort) {
      query.sort(mongoSort);
    }

    const total = await this.carsModel.countDocuments(mongoFilters).exec();
    const documents = await query.exec();

    return {
      total,
      cars: documents
    }
  }

  delete(id: string) {
    return this.carsModel.findOneAndDelete({ _id: id }).exec();
  }

  update(id: string, update: any) {
    return this.carsModel.findOneAndUpdate({ _id: id }, { $set: update }, { new: true }).exec();
  }

  create(createData: any) {
    return this.carsModel.create(createData);
  }
}
