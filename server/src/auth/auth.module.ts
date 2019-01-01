import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'

@Module({
  imports: [
    JwtModule.register({
      secretOrPrivateKey: process.env.SECRET || 'secret',
    }),
  ],
  // NOTE: exports must after providers
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
}
