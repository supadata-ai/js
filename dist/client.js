export class BaseClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async fetch(endpoint, params) {
        const url = new URL(endpoint, this.config.baseUrl || "https://api.supadata.ai/v1");
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }
        const response = await fetch(url, {
            headers: {
                "x-api-key": this.config.apiKey,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            const error = data;
            throw new SupadataError(error);
        }
        return data;
    }
}
export class SupadataError extends Error {
    code;
    title;
    documentationUrl;
    constructor(error) {
        super(error.description);
        this.code = error.code;
        this.title = error.title;
        this.documentationUrl = error.documentationUrl;
    }
}
