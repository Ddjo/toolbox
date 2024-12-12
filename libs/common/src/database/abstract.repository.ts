import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, PopulateOption, PopulateOptions, ProjectionType, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    document: Omit<TDocument, '_id'>,
    populate?: PopulateOptions
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).populate(populate || []);
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>, 
    projection : ProjectionType<TDocument>,
    populate?: PopulateOptions 
  ) {
    const document = await this.model.findOne(filterQuery, projection, {lean: true}).populate(populate || []);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    projection : ProjectionType<TDocument>,
    populate?: PopulateOptions[]
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
      projection: projection
    }).populate(populate || []);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async find(
    filterQuery: FilterQuery<TDocument>, 
    projection : ProjectionType<TDocument>, 
    populate?: PopulateOptions[]
  ) {

    console.log('populate : ', JSON.stringify(populate))
    const query =  this.model.find(filterQuery, projection, { lean: true });

    populate?.forEach(popul => {
      query.populate(popul);
    })

    return query;

  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>, 
    populate?: PopulateOptions
  ) {
    return this.model.findOneAndDelete(filterQuery, { lean: true }).populate(populate || []);
  }

}