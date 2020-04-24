require('./index');
import { UserModel } from '../models/user';

UserModel.create({
  username: 'rknguyen',
  password: '12345678',
  role: 'admin',
  fullName: 'Nguyen Minh Huy',
}).then((u) => console.log(u));
