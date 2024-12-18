import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, PopulateOption, PopulateOptions, ProjectionType, SortOrder, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    document: Omit<TDocument, '_id'>,
    populate?: PopulateOptions[]
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
    populate?: PopulateOptions[]
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
    populate?: PopulateOptions[],
    sortParam?:Record<string, SortOrder>,
    limitParam?: number,
    skipParam?: number
  ) {

    const query =  this.model.find(filterQuery, projection, { lean: true }).sort();

    populate?.forEach(popul => {
      query.populate(popul);
    })

  // Construction dynamique de l'objet sortCriteria
    if (sortParam) {
      const sortCriteria = Object.entries(sortParam).reduce((criteria, [key, order]) => {
        (criteria as any)[key] = order === 'desc' ? -1 : 1; // Convertit 'desc' et 'asc' en -1 et 1
        return criteria;
      }, {});

      console.log('sortCriteria : ', sortCriteria)
      query.sort(sortCriteria);
    }

    if(limitParam) {
      console.log('limit : ', limitParam)
      query.limit(limitParam);
    }

    if(skipParam) {
      console.log('skipParam : ', skipParam)
      query.skip(skipParam);
    }

    return query;
  }



  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>, 
    populate?: PopulateOptions[]
  ) {
    return this.model.findOneAndDelete(filterQuery, { lean: true }).populate(populate || []);
  }

  async deleteMany (
    filterQuery: FilterQuery<TDocument>, 
  ) : Promise<{ acknowledged: boolean, deletedCount: number }>{
    return this.model.deleteMany(filterQuery);
  }

}