import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll({ pagination, sort, filters }: { pagination: any, sort: any, filters: any }): Promise<{
    total: number,
    products: Product[],
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
    }

    const query = this.productModel
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

    const total = await this.productModel.countDocuments(mongoFilters).exec();
    const documents = await query.exec();

    return {
      total,
      products: documents
    }
  }

  delete(id: string) {
    return this.productModel.findOneAndDelete({ _id: id }).exec();
  }

  update(id: string, update: any) {
    return this.productModel.findOneAndUpdate({ _id: id }, { $set: update }, { new: true }).exec();
  }

  create(createData: any) {
    return this.productModel.create(createData);
  }

  getById(id: string) {
    return this.productModel.findById(id);
  }
}
