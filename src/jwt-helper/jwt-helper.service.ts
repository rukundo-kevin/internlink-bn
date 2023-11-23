import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import type { CookieOptions, Request } from 'express';
import { EnvConfig } from '@app/libs/src/dto/env.config.dto';
interface VerifyTokenArg {
  token: string;
  ignoreExpiration?: boolean;
}

@Injectable()
export class JwtHelperService {
  constructor(private envConfig: EnvConfig) {}

  getTokenFromHeader(req: Request) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return null;
    }
    const [bearer, token] = authorizationHeader.split(' ');
    if (!token || bearer !== 'Bearer') {
      return null;
    }
    return token;
  }

  async generateAccessToken(userId: number, refreshTokenId: string) {
    const secret = this.envConfig.ACCESS_TOKEN_SECRET;

    const token = jsonwebtoken.sign({ userId, refreshTokenId }, secret, {
      // jwtid: jwtId,
      algorithm: 'HS256',
      expiresIn: this.envConfig.ACCESS_TOKEN_EXPIRY,
      issuer: this.envConfig.BACKEND_URL,
      audience: [this.envConfig.FRONTEND_URL],
    });
    return token;
  }

  async generateRefreshToken(userId: number) {
    const secret = this.envConfig.REFRESH_TOKEN_SECRET;

    // const jwtId = (await cryptoUtils.asyncRandomBytes(32)).toString('hex');

    const token = jsonwebtoken.sign({ userId }, secret, {
      // jwtid: jwtId,
      algorithm: 'HS256',
      expiresIn: this.envConfig.REFRESH_TOKEN_EXPIRY,
      issuer: this.envConfig.BACKEND_URL,
      audience: [this.envConfig.FRONTEND_URL],
    });

    return { token };
  }

  async generateAuthTokens(userId: number) {
    const refreshToken = await this.generateRefreshToken(userId);
    const accessToken = await this.generateAccessToken(
      userId,
      refreshToken.token,
    );

    return { accessToken, refreshToken: refreshToken.token };
  }

  async verifyAccessToken(verifyTokenArg: VerifyTokenArg) {
    try {
      const secret = this.envConfig.ACCESS_TOKEN_SECRET;

      const payload = jsonwebtoken.verify(verifyTokenArg.token, secret, {
        ignoreExpiration: verifyTokenArg.ignoreExpiration,
        algorithms: ['HS256'],
        issuer: this.envConfig.BACKEND_URL,
        audience: [this.envConfig.FRONTEND_URL],
      }) as jsonwebtoken.JwtPayload;

      return payload;
    } catch (error) {
      throw error;
    }
  }

  async verifyRefreshToken(verifyTokenArg: VerifyTokenArg) {
    try {
      const secret = this.envConfig.REFRESH_TOKEN_SECRET;

      const payload = jsonwebtoken.verify(verifyTokenArg.token, secret, {
        ignoreExpiration: verifyTokenArg.ignoreExpiration,
        algorithms: ['HS256'],
        issuer: this.envConfig.BACKEND_URL,
        audience: [this.envConfig.FRONTEND_URL],
      }) as jsonwebtoken.JwtPayload;

      return payload;
    } catch (error) {
      return null;
    }
  }

  async refreshAccessToken(req: Request) {
    const { refreshToken } = req.cookies;
    const accessToken = this.getTokenFromHeader(req);

    if (!accessToken || !refreshToken) {
      return null;
    }

    const payload = await this.verifyRefreshToken({ token: refreshToken });
    if (!payload) {
      return null;
    }
    const accessTokenPayload = await this.verifyAccessToken({
      token: accessToken,
      ignoreExpiration: true,
    });
    if (
      !accessTokenPayload ||
      accessTokenPayload.refreshTokenId !== payload.jti
    ) {
      return null;
    }
    const newAccessToken = this.generateAccessToken(
      payload.userId,
      payload.jti!,
    );
    return newAccessToken;
  }

  getCookieOptions(rememberMe: boolean): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      signed: false,

      sameSite: 'none',
      maxAge: rememberMe
        ? 1000 * 60 * 60 * 24 * 30 // 30days
        : 1000 * 60 * 60 * 24 * 1, //1day
    };
  }
}
