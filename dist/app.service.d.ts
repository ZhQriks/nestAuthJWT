import { User } from './user.entity';
import { Repository } from 'typeorm';
export declare class AppService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(data: any): Promise<User>;
    findOne(condition: any): Promise<User>;
}
