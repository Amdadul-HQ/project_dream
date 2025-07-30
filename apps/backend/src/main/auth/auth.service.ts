// src/auth/auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { RegisterUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterUserDto, profile?: Express.Multer.File) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Handle profile picture
    const profileUrl = profile ? `/uploads/${profile.filename}` : null;

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        profile: profileUrl,
        isGoogle: false,
        role: Role.USER,
      },
    });

    // Create Auth entry
    await this.prisma.auth.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: Role.USER,
        userId: user.id,
      },
    });

    // Check if any social media links are provided
    const socialLinks = {
      facebook: dto.facebook,
      youtube: dto.youtube,
      twitter: dto.twitter,
      instagram: dto.instagram,
      pinterest: dto.pinterest,
      linkedin: dto.linkedin,
      tiktok: dto.tiktok,
    };

    const hasSocialLinks = Object.values(socialLinks).some((v) => !!v);

    if (hasSocialLinks) {
      await this.prisma.userSocialMedia.create({
        data: {
          userId: user.id,
          ...socialLinks,
        },
      });
    }

    return { message: 'User registered successfully', user };
  }
}
