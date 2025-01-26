import { AxiosInstance } from 'axios';
import { SupadataConfig, Error } from './types';
export declare class BaseClient {
    protected client: AxiosInstance;
    protected config: SupadataConfig;
    constructor(config: SupadataConfig);
}
export declare class SupadataError extends Error {
    code: Error['code'];
    title: string;
    documentationUrl: string;
    constructor(error: Error);
}
