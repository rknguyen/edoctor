"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const server_1 = require("./server");
require('./db');
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const server = yield common_1.ServerLoader.bootstrap(server_1.Server, {});
            yield server.listen();
        }
        catch (err) {
            common_1.$log.error(err);
        }
    });
}
bootstrap();
//# sourceMappingURL=index.js.map