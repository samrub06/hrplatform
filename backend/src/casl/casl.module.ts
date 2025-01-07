import { Module } from '@nestjs/common';
import { PermissionModule } from '../permission/permission.module';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [PermissionModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
