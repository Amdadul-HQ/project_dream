// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { RegisterUserDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { UtilsService } from '@project/lib/utils/utils.service';
import { successResponse } from '@project/common/utils/response.util';
// import { AppError } from '@project/common/error/handle-error.app';
// import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
// import { HandleError } from '@project/common/error/handle-error.decorator';
// import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly libUtils: UtilsService,
    // private readonly cloudinaryService: CloudinaryService,
  ) {}

  //   @HandleError('Registration Failed')
  async register(dto: RegisterUserDto, file: string | null) {
    try {
      // 1️⃣ Check if file exists
      if (!file) {
        throw new BadRequestException('Profile image is required');
      }

      // 2️⃣ Check if user already exists
      const existingUser = await this.prisma.user.findFirstOrThrow({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      // 3️⃣ Upload profile image (replace with your Cloudinary logic)

      // For now use local path (debugging)

      // 4️⃣ Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 5️⃣ Create user, auth, and social media in a transaction
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            address: dto.address,
            profile: file,
            role: Role.USER
          },
        });

        await tx.auth.create({
          data: {
            email: user.email,
            name: user.name,
            password: hashedPassword,
            role: Role.USER,
            userId: user.id,
          },
        });

        // Handle social media
        const socialLinks = {
          facebook: dto.facebook,
          youtube: dto.youtube,
          twitter: dto.twitter,
          instagram: dto.instagram,
          pinterest: dto.pinterest,
          linkedin: dto.linkedin,
          tiktok: dto.tiktok,
        };

        if (Object.values(socialLinks).some(Boolean)) {
          await tx.userSocialMedia.create({
            data: {
              userId: user.id,
              ...socialLinks,
            },
          });
        }

        return {
          success: true,
          message: 'User registered successfully',
          data: user,
        };
      });
    } catch (err) {
      console.error('REGISTER ERROR:', err);

      if (err instanceof BadRequestException) throw err;

      throw new InternalServerErrorException(
        'Internal server error during registration',
      );
    }
  }

  async login (loginDto:LoginDto) {
      const {email,password} = loginDto

      const user = await this.prisma.user.findUnique({
        where:{email}
      })

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const creadintials = await this.prisma.auth.findUnique({
        where:{userId:user.id}
      })

      if(!creadintials) {
        throw new NotFoundException('User does not exist');
      }
       const isPasswordMatch = await this.libUtils.comparePassword({
        password,
        hashedPassword: creadintials.password,
      });

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Password does not match');
      }

      const data = {
      user,
      token: this.libUtils.generateToken({
        email: user.email,
        roles: user.role,
        sub: user.id,
      }),
    };
     return successResponse(data, 'Login successful');
  }

  //   async googleLogin(token: string) {
  //     const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //     });

  //     const payload = ticket.getPayload();
  //     if (!payload) throw new BadRequestException('Invalid Google token');

  //     const { email, name, picture } = payload;

  //     let user = await this.prisma.user.findUnique({ where: { email } });

  //     if (!user) {
  //       user = await this.prisma.user.create({
  //         data: {
  //           name,
  //           email,
  //           profile: picture,
  //           isGoogle: true,
  //         },
  //       });
  //     }

  //     return { message: 'Google login success', user };
  //   }
}
