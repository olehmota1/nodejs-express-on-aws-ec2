import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import env from '@/config/env.config';
import { IAuthedUser } from './types';
import { UserService } from '@/user/user.service';
import { UserRole } from '@/user/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${env().cognitoAuthority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: env().cognitoClientId,
      issuer: env().cognitoAuthority,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any): Promise<IAuthedUser> {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid user.');
    }

    const role: UserRole = payload['cognito:groups'][0];

    if (role === UserRole.SUPER_ADMIN) {
      return {
        userId: 0,
        userEmail: payload.email,
        userRole: role,
      };
    }

    const user = await this.userService.findOne({
      userCognitoId: payload.sub,
      userActive: true,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user.');
    }

    return {
      userId: user.userId,
      userEmail: user.userEmail,
      userRole: user.userRole,
      companyId: user.companyId,
    };
  }
}
