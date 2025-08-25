import { ConferenceService } from '../conference/conference.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthenticationService } from './authentication.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  const mockAuthenticationService = {
    loginAuthorize: jest.fn((e: any, room: string) => 'internet'),
  };
  const mockConferenceService = {
    whereami: jest.fn((elt: string) => elt),
    // loginAuthorize: jest.fn((e: any, room: string) => 'internet'),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule, JwtModule],
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService,
        },
        {
          provide: ConferenceService,
          useValue: mockConferenceService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('whereami should return internet', () => {
    expect(controller.whereami('internet')).toEqual('internet');
  });

  // it('loginAuthorize should return internet', () => {
  //   expect(controller.loginAuthorize({} as Response, 'jhgjhg68768')).toEqual(
  //     'internet',
  //   );
  // });
});
