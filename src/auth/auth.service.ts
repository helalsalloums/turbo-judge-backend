import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";

import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) { }

  async signup(dto: SignupDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })

    if (userExists) throw new BadRequestException("Email already taken")

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      }
    })

    return { message: "User created", user: { email: newUser.email } }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    })


    if (!user) {
      throw new BadRequestException("Invalid credentials")
    }

    const passwordCorrect = await bcrypt.compare(dto.password, user.password);

    if (!passwordCorrect) {
      throw new BadRequestException("Invalid credentials")
    }

    const token = await this.jwt.signAsync({
      sub: user.id,
      role: user.role
    }, { expiresIn: process.env.JWT_EXPIRE_IN as any });

    const refreshToken = await this.jwt.signAsync({
      sub: user.id,
      role: user.role
    }, {
      expiresIn: process.env.REFRESH_JWT_EXPIRE_IN as any,
      secret: process.env.REFRESH_JWT_SECRET!
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return { message: "Logged in successfully", access_token: token, refresh_token: refreshToken }
  }

  // TODO : refactor the token to store also the tokenId so we avoid the for loop
  // TODO : rotate refresh token so it's used only once
  async refresh(refreshToken: string) {
    const payload = await this.jwt.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_JWT_SECRET!
    });

    const DBrefreshTokens = await this.prisma.refreshToken.findMany({
      where: { userId: payload.sub }
    });

    for (let i = 0; i < DBrefreshTokens.length; i++) {
      const match = await bcrypt.compare(refreshToken, DBrefreshTokens[i].tokenHash);
      if (match) {
        if (DBrefreshTokens[i].expiresAt < new Date()) {
          throw new UnauthorizedException("Refresh Token Expired");
        }

        const token = await this.jwt.signAsync({
          sub: payload.sub,
          role: payload.role
        }, { expiresIn: process.env.JWT_EXPIRE_IN as any });

        return { message: "Token refreshed successfully", access_token: token, refresh_token: refreshToken }
      }
    }
    throw new UnauthorizedException("didn't find your Refresh Token");
  }

  // TODO : same for refresh
  // idempotent logout
  async logout(refreshToken: string) {
    const payload = await this.jwt.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_JWT_SECRET!
    });

    const DBrefreshTokens = await this.prisma.refreshToken.findMany({
      where: { userId: payload.sub }
    });

    for (let i = 0; i < DBrefreshTokens.length; i++) {
      const match = await bcrypt.compare(refreshToken, DBrefreshTokens[i].tokenHash);
      if (match) {
        await this.prisma.refreshToken.delete({
          where: { id: DBrefreshTokens[i].id }
        });
        return { message: "Token deleted successfully" }
      }
    }
    return { message: "Token wasn't found" }

  }
}
