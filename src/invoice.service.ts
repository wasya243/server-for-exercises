import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Invoice } from './invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<Invoice>) {}

  async findAll({ pagination, sort, filters }: { pagination: any, sort: any, filters: any }): Promise<{
    total: number,
    invoices: Invoice[],
  }> {
    let mongoFilters = {};
    if (!_.isEmpty(filters)) {
      if(filters.amountTo && !filters.amountFrom) {
        mongoFilters = {
          amount: {
            $lte: filters.amountTo
          }
        };
      } else if (filters.amountFrom && !filters.amountTo) {
        mongoFilters = {
          amount: {
            $gte: filters.amountFrom
          }
        };
      } else if (filters.amountTo && filters.amountFrom) {
        mongoFilters = {
          $and: [
            { 
              amount: {
                $gte: filters.amountFrom
              }
            },
            {
              amount: {
                $lte: filters.amountTo
              }
            }
          ]
        };
      }
    }

    const query = this.invoiceModel
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

    const total = await this.invoiceModel.countDocuments(mongoFilters).exec();
    const documents = await query.exec();

    return {
      total,
      invoices: documents
    }
  }

  delete(id: string) {
    return this.invoiceModel.findOneAndDelete({ _id: id }).exec();
  }

  update(id: string, update: any) {
    return this.invoiceModel.findOneAndUpdate({ _id: id }, { $set: update }, { new: true }).exec();
  }
}
