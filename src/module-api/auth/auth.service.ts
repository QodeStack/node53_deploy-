import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "src/modules-system/prisma/prisma.service";
import * as bcrypt from 'bcrypt'
import { TokenService } from "src/modules-system/token/token.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,private tokenService :TokenService) { }
    async login(body: LoginDto) {
        const { email, password } = body;
        //kiểm tra email người dùng có tồn tại trong db hay không 
        //nếu mà tồn tại => đi tiếp 
        //nếu mà chưa tồn tại => trả lỗi ( Xin vui lòng đăng kí trước khi đăng nhập )
        const userExist = await this.prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!userExist) {
            throw new BadRequestException("Xin vui lòng đăng kí trước khi đăng nhập")
        }

        if (!userExist.password){
            throw new BadRequestException("Đăng nhập bằng google để cập nhật mật khẩu") 
        }
        // kiểm tra password 
        const isPassword = bcrypt.compareSync(password, userExist.password)
        if (!isPassword) {
            throw new BadRequestException("Mật khẩu chưa chính xác ")
        }

        //Encrypt : Mã hóa 
        // mã hóa 2 chiều : CÓ THỂ DỊCH ĐƯỢC 
        const token = this.tokenService.createTokens(userExist.id);
        // console.log({email,password,userExist});
        return token;
    }
}