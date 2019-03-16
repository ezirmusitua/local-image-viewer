import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';

describe('AppController', () => {
  const app: TestingModule = null;

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.version()).toBe('0.1.0');
    });
  });
});
