import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (sequelize: Sequelize) => sequelize.getRepository(User),
    inject: ['SEQUELIZE'],
  },
];
