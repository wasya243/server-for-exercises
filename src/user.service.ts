import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll({ pagination, sort, filters }: { pagination: any, sort: any, filters: any }): Promise<{
    total: number,
    users: User[],
  }> {
    let mongoFilters = {};
    if (!_.isEmpty(filters)) {
      if(filters.salaryTo && !filters.salaryFrom) {
        mongoFilters = {
          salary: {
            $lte: filters.salaryTo
          }
        };
      } else if (filters.salaryFrom && !filters.salaryTo) {
        mongoFilters = {
          salary: {
            $gte: filters.salaryFrom
          }
        };
      } else if (filters.salaryTo && filters.salaryFrom) {
        mongoFilters = {
          $and: [
            { 
              salary: {
                $gte: filters.salaryFrom
              }
            },
            {
              salary: {
                $lte: filters.salaryTo
              }
            }
          ]
        };
      }
    }

    const query = this.userModel
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

    const total = await this.userModel.countDocuments(mongoFilters).exec();
    const documents = await query.exec();

    return {
      total,
      users: documents
    }
  }

  delete(id: string) {
    // throw new Error('smth went wrong');
    return this.userModel.findOneAndDelete({ _id: id }).exec();
  }

  update(id: string, update: any) {
    return this.userModel.findOneAndUpdate({ _id: id }, { $set: update }, { new: true }).exec();
  }
}
