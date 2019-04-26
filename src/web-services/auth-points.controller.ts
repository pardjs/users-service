import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthPointName, RegisterAuthPointsDto } from '@pardjs/users-service-common';
import { UsersServiceAuthPoints } from '../auth-points/auth-points.enum';
import { AuthPointsService } from '../auth-points/auth-points.service';
import { DynamicRolesGuard } from '../auth/dynamic-roles.guard';

@Controller('auth-points')
@ApiUseTags('AuthPoints')
export class AuthPointController {
    constructor(private readonly authPointService: AuthPointsService) {}

    @Post('actions/register')
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @AuthPointName(UsersServiceAuthPoints.ACT_AUTH_POINT_REGISTER)
    @ApiBearerAuth()
    async register(@Body() body: RegisterAuthPointsDto ) {
        return this.authPointService.register(body);
    }

    @Get('')
    @AuthPointName(UsersServiceAuthPoints.FIND_AUTH_POINTS)
    @UseGuards(AuthGuard('jwt'), DynamicRolesGuard)
    @ApiBearerAuth()
    async find() {
        const result = await this.authPointService.findAndCount();
        return { data: result[0], count: result[1] };
    }
}
