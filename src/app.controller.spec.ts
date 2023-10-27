import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mainInterface } from './app.main.interface';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('/', () => {
    it('should return {}', async () => {
      const response = await appController.healthChecker()
      let resType: mainInterface = {'status_code': 200, 'detail': 'ok', 'result': 'working'};
      expect(response).toEqual(resType)
    });
    it('should\'nt return "some string"', async () => {
      const response = await appController.healthChecker()
      expect(response).not.toEqual('some string')
    });
  });
});
