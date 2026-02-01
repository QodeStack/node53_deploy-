import { Body, Controller, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoggingInterceptor } from "src/common/interceptors/logging.interceptor";
import { Public } from "src/common/decorators/public.decorator";

@Controller("auth")
export class AuthController {

    constructor(private authService:AuthService) {}

    @Post("login")
    @Public() // {isPublic : true}
    login(
        @Body()
        body :LoginDto,
        @Param()
        param,
        @Query()
        query

    ) {
        //console.log({body,param,query});
        const result = this.authService.login(body);
        return result;
    }
}