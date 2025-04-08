import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENVIRONMENT } from 'src/common/config';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENVIRONMENT.JWT.ACCESS_SECRET,
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    console.log('payload', payload);
    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      principalId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
