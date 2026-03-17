import { Injectable, BadRequestException } from "@nestjs/common";
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
}
