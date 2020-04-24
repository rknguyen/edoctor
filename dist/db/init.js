"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./index');
const user_1 = require("../models/user");
user_1.UserModel.create({
    username: 'rknguyen',
    password: '12345678',
    role: 'admin',
    fullName: 'Nguyen Minh Huy',
}).then((u) => console.log(u));
//# sourceMappingURL=init.js.map