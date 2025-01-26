"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupadataError = exports.BaseClient = void 0;
const axios_1 = __importDefault(require("axios"));
class BaseClient {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: config.baseUrl || 'https://api.supadata.ai/v1',
            headers: {
                'x-api-key': config.apiKey,
                'Content-Type': 'application/json',
            },
        });
        // Add response interceptor to handle errors
        this.client.interceptors.response.use(response => response, error => {
            var _a;
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
                const apiError = error.response.data;
                throw new SupadataError(apiError);
            }
            throw error;
        });
    }
}
exports.BaseClient = BaseClient;
class SupadataError extends Error {
    constructor(error) {
        super(error.description);
        this.code = error.code;
        this.title = error.title;
        this.documentationUrl = error.documentationUrl;
    }
}
exports.SupadataError = SupadataError;
