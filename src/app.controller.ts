import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @SkipThrottle()
  @ApiTags('Service')
  @ApiOperation({ summary: 'Checking backend status' })
  @ApiOkResponse({
    description: 'Service works',
    schema: {
      type: 'string',
      example: 'OK',
    },
  })
  async getStatus(): Promise<'OK'> {
    return this.appService.getStatus();
  }
}
