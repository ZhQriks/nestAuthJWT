import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
export declare class AppController {
    private readonly appService;
    private jwtService;
    constructor(appService: AppService, jwtService: JwtService);
    register(name: string, surname: string, email: string, password: string, phone: string, role: string, username: string): Promise<import("./user.entity").User>;
    login(username: string, password: string, response: Response): Promise<{
        massage: string;
    }>;
    user(reqest: Request): Promise<import("./user.entity").User>;
    logout(response: Response): Promise<{
        massage: string;
    }>;
}
