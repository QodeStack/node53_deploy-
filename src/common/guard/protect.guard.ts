
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { TokenService } from 'src/modules-system/token/token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { PrismaClient } from 'src/modules-system/prisma/generated/prisma/client';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class ProtectGuard implements CanActivate {
    constructor(private tokenService: TokenService,
        private reflector: Reflector,
        private prisma : PrismaService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // nếu hàm canActivate return false thì sẽ luôn trả về 403 
        //return false;

        // lấy cờ isPublic trong mọi API để xem thử có được đánh true hay không 
        // nếu cờ đánh true thì hàm conActivate return true 
        // nếu cờ không đánh undefind  => cho code chạy tiếp 
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log({ isPublic });
        if (isPublic) {
            // 💡 See this condition
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            // 💡 Here the JWT secret key that's used for verifying the payload 
            // is the key that was passsed in the JwtModule
            const payload = await this.tokenService.verifyAccessToken(token);
            //  console.log({ payload });
            const userExits = await this.prisma.users.findUnique({
                where: {
                    id: (payload as any).userId,
                },
            });
            if (!userExits) { 
                throw new UnauthorizedException('Không tìm thấy User');
            }
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = userExits;
        } catch (err) {
            switch (err.constructor) {
                case TokenExpiredError:
                    // token hết hạn: 403 (FE gọi API refreshToken)
                    throw new ForbiddenException(err.message)
                default:
                    // mọi lỗi còn lại của token: 401 (FE-logout)
                    throw new UnauthorizedException();
            }
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
