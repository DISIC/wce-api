import { roomNameDTO } from './DTOs/conference.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ConferenceController } from './conference.controller';
import { ConferenceService } from './conference.service';

describe('ConferenceController', () => {
  const roomName = 'conference123456';
  const jwt = 'fegugeguguu.egfgugb687687gjGJHJB.GVHGJBhu76887Y8';
  type args = { room: string; email: string; host: 'bjbjbj' };
  let controller: ConferenceController;
  const mockConferenceService = {
    roomExists: (e: roomNameDTO) => {
      return { roomName: e };
    },
    getRoomAccessToken: (room: roomNameDTO) => {
      return { roomName: room, jwt };
    },
    getRoomAccessTokenByEmail: (args: args) => {
      return { roomName: args.room, jwt };
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConferenceController],
      providers: [ConferenceService],
    })
      .overrideProvider(ConferenceService)
      .useValue(mockConferenceService)
      .compile();

    controller = module.get<ConferenceController>(ConferenceController);
  });

  it('ConferenceController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('roomExists should return an object of the same roomName', () => {
    expect(controller.roomExists({ roomName })).toEqual({
      roomName: 'conference123456',
    });
  });

  it('getRoomAccessToken should return an object of the same roomName and a jwt', () => {
    expect(controller.getRoomAccessToken({ roomName }, '', '')).toEqual({
      roomName: 'conference123456',
      jwt,
    });
  });

  it('getRoomAccessTokenByEmail should return an object of the same roomName and a jwt', () => {
    expect(
      controller.getRoomAccessTokenByEmail(
        { roomName, email: 'test@test.com' },
        'internet',
      ),
    ).resolves.toEqual({
      roomName: 'conference123456',
      jwt,
    });
  });
});
