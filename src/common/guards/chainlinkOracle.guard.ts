import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChainlinkOracleGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['x-api-key'];
    const expectedKey = this.configService.get<string>(
      'CHAINLINK_ORACLE_API_KEY',
    );
    return key === expectedKey;
  }
}
