import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthPointName, CreateRoleDto, SetRoleAuthPointsDto } from '@pardjs/auth-service-common';
import { AuthPoints, DynamicRolesGuard, RolesService } from '../../BLL';
import { RolesApiService } from './roles-api.service';
import { UpsertRoleDto } from './upsert-role.dto';

@Controller('roles')
@ApiUseTags('Roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly rolesApiService: RolesApiService,
    ) {}

    @Get('')
    @AuthPointName(AuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async find() {
        const result = await this.rolesService.findAndCount({
            where: {
                shownInApp: true,
            },
            select: ['id', 'name', 'createdAt', 'updatedAt'],
        });
        return { data: result[0], count: result[1] };
    }

    @Get(':id')
    @AuthPointName(AuthPoints.FIND_ROLE)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async findById(@Param('id') id: number) {
        return this.rolesService.findByIdDetail(id);
    }

    @Post('')
    @AuthPointName(AuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async create(@Body() data: CreateRoleDto) {
        const role = await this.rolesService.create(data.name);
        return role;
    }

    @Put(':id')
    @AuthPointName(AuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async update(@Param('id') id: number, @Body() data: UpsertRoleDto) {
        return this.rolesService.update(id, data.name);
    }

    @Put(':id/auth-points')
    @AuthPointName(AuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async setRoleAuthPoints(@Param('id') id: number, @Body() data: SetRoleAuthPointsDto) {
        return this.rolesApiService.setRoleAuthPoints(id, data);
    }

    @Delete(':id')
    @AuthPointName(AuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async remove(@Param('id') id: number) {
        return this.rolesService.remove(id);
    }
}
