import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest
              .fn()
              .mockResolvedValue(
                'Connection to Database Successful! User count: 2',
              ),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return database connection status', async () => {
      const result = await appController.getHello();
      expect(result).toContain('Connection to Database Successful!');
    });
  });
});
