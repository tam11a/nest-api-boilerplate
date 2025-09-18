import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAdminDto: CreateAdminDto) {
    return await this.prisma.$transaction(async (prisma) => {
      // Generate passphrase
      // const passphrase = Math.random().toString(36).slice(-8);
      // createAdminDto.passphrase = passphrase;

      // createAdminDto.passhash = await bcrypt.hash(passphrase, 10);

      return await prisma.admin.create({
        data: { ...createAdminDto },
      });
    });
  }

  async findAll(skip: number, take: number) {
    const where: Prisma.AdminWhereInput = {};

    const [results, total] = await this.prisma.$transaction([
      this.prisma.admin.findMany({
        where,
        skip,
        take,
      }),
      this.prisma.admin.count(),
    ]);

    return { results, total };
  }

  async findOne(id: number) {
    return await this.prisma.admin.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    return await this.prisma.admin.update({
      where: { id },
      data: { ...updateAdminDto },
    });
  }

  async remove(id: number) {
    return await this.prisma.admin.delete({
      where: { id },
    });
  }
}
