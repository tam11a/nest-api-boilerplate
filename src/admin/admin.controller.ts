import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Paginated } from 'lib';
import { Skip } from 'lib/decorators/skip.decorator';
import { Take } from 'lib/decorators/take.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminService.create(createAdminDto);
  }

  @Get()
  @Paginated()
  async findAll(@Skip() skip: number, @Take() take: number) {
    return await this.adminService.findAll(skip, take);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adminService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return await this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adminService.remove(+id);
  }
}
