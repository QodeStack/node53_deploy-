import { Injectable } from "@nestjs/common";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "src/common/constant/app.constant";
import * as jsonwebtoken from "jsonwebtoken"
@Injectable()
export class TokenService {
    createTokens(userId) {
        const accessToken = jsonwebtoken.sign({ userId: userId }, ACCESS_TOKEN_SECRET as string, { expiresIn: "5s" });
        const refreshToken = jsonwebtoken.sign({ userId: userId }, REFRESH_TOKEN_SECRET as string, { expiresIn: "1d" });

        //console.log(refreshToken);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    }
    verifyAccessToken(accessToken:string, options?: jsonwebtoken.VerifyOptions) {
        const decode = jsonwebtoken.verify(accessToken, ACCESS_TOKEN_SECRET as string, options);
        return decode;
    }
    verifyRefreshToken(refreshToken) {
        const decode = jsonwebtoken.verify(refreshToken, REFRESH_TOKEN_SECRET as string);
        return decode;
    }
}