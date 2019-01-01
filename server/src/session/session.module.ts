import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {
}
