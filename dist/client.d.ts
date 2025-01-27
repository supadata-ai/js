import { SupadataConfig, Error } from "./types.js";
export declare class BaseClient {
    protected config: SupadataConfig;
    constructor(config: SupadataConfig);
    fetch<T>(endpoint: string, params: Record<string, unknown> | object): Promise<T>;
}
export declare class SupadataError extends Error {
    code: Error["code"];
    title: string;
    documentationUrl: string;
    constructor(error: Error);
}
