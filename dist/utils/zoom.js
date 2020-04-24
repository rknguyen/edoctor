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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const axios_1 = __importDefault(require("axios"));
function zoomScheduleMeeting() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const zoomResponse = yield axios_1.default('https://api.zoom.us/v2/users/me/meetings', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.ZOOM_JWT}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    topic: 'Meeting with doctor',
                    password: process.env.DEFAULT_ZOOM_MEETING_PASSWORD,
                    settings: {
                        join_before_host: true,
                        enforce_login: false,
                        meeting_authentication: false,
                        waiting_room: false,
                    },
                },
            });
            return zoomResponse.data;
        }
        catch (error) {
            return { error: error.response.data };
        }
    });
}
exports.zoomScheduleMeeting = zoomScheduleMeeting;
//# sourceMappingURL=zoom.js.map