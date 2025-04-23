"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNpmMetadata = fetchNpmMetadata;
const axios_1 = __importDefault(require("axios"));
const NPM_REGISTRY_URL = 'https://registry.npmjs.org';
async function fetchNpmMetadata(packageName) {
    try {
        const response = await axios_1.default.get(`${NPM_REGISTRY_URL}/${packageName}`);
        const data = response.data;
        const latestVersion = data['dist-tags'].latest;
        const latestVersionData = data.versions[latestVersion];
        // Check for ESM support through various indicators
        const hasESM = Boolean(latestVersionData.module ||
            latestVersionData.type === 'module' ||
            latestVersionData.exports);
        return {
            lastUpdate: new Date(data.time[latestVersion]),
            hasESM,
            dependencies: Object.keys(latestVersionData.dependencies || {})
        };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(`Failed to fetch npm metadata for ${packageName}: ${error.message}`);
        }
        throw error;
    }
}
