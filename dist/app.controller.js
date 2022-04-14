"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AppController = class AppController {
    constructor(appService, jwtService) {
        this.appService = appService;
        this.jwtService = jwtService;
    }
    async register(name, surname, email, password, phone, role, username) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.appService.create({
            name,
            email,
            password: hashedPassword,
            surname,
            phone,
            role,
            username,
        });
        user.password = undefined;
        return user;
    }
    async login(username, password, response) {
        const user = await this.appService.findOne({ username });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new common_1.BadRequestException('Wrong password');
        }
        const jwt = await this.jwtService.signAsync({
            id: user.id,
        });
        response.cookie('jwt', jwt, { httpOnly: true });
        return { massage: 'Logged in' };
    }
    async user(reqest) {
        try {
            const cookie = reqest.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);
            if (!data) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            const user = await this.appService.findOne({ id: data.id });
            user.password = undefined;
            return user;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
    async logout(response) {
        response.clearCookie('jwt');
        return { massage: 'Logged out' };
    }
};
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)('name')),
    __param(1, (0, common_1.Body)('surname')),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('password')),
    __param(4, (0, common_1.Body)('phone')),
    __param(5, (0, common_1.Body)('role')),
    __param(6, (0, common_1.Body)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('username')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "logout", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        jwt_1.JwtService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map