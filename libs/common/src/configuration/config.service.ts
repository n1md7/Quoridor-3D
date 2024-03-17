import { ConfigurationType } from '/common/configuration/configuration';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService extends NestConfigService<ConfigurationType> {}
