import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  const mockFeedbackService = {
    createFeedback: () => {
      return {};
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [FeedbackService],
    })
      .overrideProvider(FeedbackService)
      .useValue(mockFeedbackService)
      .compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  it('FeedbackController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createFeedback should return {}', () => {
    expect(
      controller.createFeedback(
        { signedCookies: '', ip: '' } as Request,
        { isVPN: 1, rt: { inv: 1, qty: 1 }, com: '' },
        '',
      ),
    ).toEqual({});
  });
});
