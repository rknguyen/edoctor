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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("@tsed/swagger");
const rootDir = __dirname;
let Server = class Server extends common_1.ServerLoader {
    constructor(settings) {
        super(settings);
    }
    $beforeRoutesInit() {
        this.use(common_1.GlobalAcceptMimesMiddleware)
            .use(cors_1.default({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true }))
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }));
    }
};
Server = __decorate([
    common_1.ServerSettings({
        rootDir,
        swagger: [
            {
                path: '/docs',
            },
        ],
        acceptMimes: ['application/json'],
        httpPort: process.env.PORT || 8081,
        httpsPort: false,
        logger: {
            disableRoutesSummary: true,
        },
        mount: {
            '/api': [`${rootDir}/controllers/**/*.ts`],
        },
        componentsScan: [`${rootDir}/middlewares/**.ts`],
    }),
    __metadata("design:paramtypes", [Object])
], Server);
exports.Server = Server;
//# sourceMappingURL=server.js.map