"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBundleSize = analyzeBundleSize;
const axios_1 = __importDefault(require("axios"));
const BUNDLEPHOBIA_API = 'https://bundlephobia.com/api/size';
async function analyzeBundleSize(packageName, version) {
    try {
        const response = await axios_1.default.get(`${BUNDLEPHOBIA_API}?package=${packageName}@${version}`);
        const data = response.data;
        return {
            size: data.size,
            gzipSize: data.gzip,
            isTreeShakeable: data.hasJSModule || data.hasJSNext || data.hasSideEffects === false
        };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(`Failed to analyze bundle size for ${packageName}@${version}: ${error.message}`);
        }
        throw error;
    }
}
