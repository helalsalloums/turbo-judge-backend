import { Injectable , BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma : PrismaService) {}

    async signup(dto : any) {
        const userExists = await this.prisma.user.findUnique({
            where: { email : dto.email }
        })

        if(userExists) throw new BadRequestException("Email already taken")

        const newUser = await this.prisma.user.create({
            data : {
                email:dto.email,
                password:dto.password,
                name : dto.name,
            }
        })

        return {message : "User created" , user:{email:newUser.email}}
    }

    async login(dto : any) {
        const user = await this.prisma.user.findUnique({
            where : {email : dto.email}
        })

        if(!user || user.password !== dto.password) {
            throw new BadRequestException("Invalid credentials")
        }

        return {message : "Logged in successfully" , userId : user.id}
    }
}