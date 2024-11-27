import { Test, TestingModule } from '@nestjs/testing';
import { booksController } from './books.controller';
import { booksService } from './book.service';

describe('booksController', () => {
  let controller: booksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [booksController],
      providers: [booksService],
    }).compile();

    controller = module.get<booksController>(booksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
