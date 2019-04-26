import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthPointName, CreateRoleDto, SetRoleAuthPointsDto } from '@pardjs/users-service-common';
import { UsersServiceAuthPoints } from '../auth-points/auth-points.enum';
import { DynamicRolesGuard } from '../auth/dynamic-roles.guard';
import { RolesService } from '../roles/roles.service';
import { RolesApiService } from './roles-api.service';

@Controller('roles')
@ApiUseTags('Roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly rolesApiService: RolesApiService,
    ) {}

    @Get('')
    @AuthPointName(UsersServiceAuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async find() {
        const result = await this.rolesService.findAndCount();
        return { data: result[0], count: result[1] };
    }

    @Get(':id')
    @AuthPointName(UsersServiceAuthPoints.FIND_ROLE)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async findById(@Param('id') id: number) {
        return this.rolesService.findByIdDetail(id);
    }

    @Post('')
    @AuthPointName(UsersServiceAuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async create(@Body() data: CreateRoleDto) {
        const role = await this.rolesService.create(data.name);
        return role;
    }

    @Put(':id')
    @AuthPointName(UsersServiceAuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async update(@Param('id') id: number, @Body('name') name: string) {
        return this.rolesService.update(id, name);
    }

    @Put(':id/auth-points')
    @AuthPointName(UsersServiceAuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async setRoleAuthPoints(@Param('id') id: number, @Body() data: SetRoleAuthPointsDto) {
        return this.rolesApiService.setRoleAuthPoints(id, data);
    }

    @Delete(':id')
    @AuthPointName(UsersServiceAuthPoints.FIND_ROLES)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async remove(@Param('id') id: number) {
        return this.rolesService.remove(id);
    }
}
