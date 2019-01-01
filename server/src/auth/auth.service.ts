import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {
  }

  public sign(payload) {
    return this.jwtService.sign(payload);
  }

  public verify(token: string) {
    if (token.startsWith('Bearer ')) {
      return this.jwtService.verify(token.slice(7))
    }
    return this.jwtService.verify(token);
  }

  public decode(token: string) {
    if (token.startsWith('Bearer ')) {
      return this.jwtService.decode(token.slice(7))
    }
    return this.jwtService.decode(token);
  }
}
