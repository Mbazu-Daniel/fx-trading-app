import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IAuthenticatedUserRequest, JwtPayload } from '../interfaces';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtPayload>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const request = context
      .switchToHttp()
      .getRequest<IAuthenticatedUserRequest>();

    if (err) {
      throw new UnauthorizedException(
        `Authentication error: ${err.message || 'Unknown error'}`,
      );
    }

    if (!user) {
      throw new UnauthorizedException(
        "Authentication failed: You're not logged in",
      );
    }

    const jwtUser = user as JwtPayload;
    if (!jwtUser.principalId || !jwtUser.email || !jwtUser.role) {
      throw new UnauthorizedException('Invalid user payload');
    }

    request.auth = {
      principalId: jwtUser.principalId,
      email: jwtUser.email,
      role: jwtUser.role,
    };

    return user;
  }
}
