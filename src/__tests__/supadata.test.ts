import { Supadata } from "../index.js";
import fetchMock from "jest-fetch-mock";
import type {
  Transcript,
  TranslatedTranscript,
  Scrape,
  Map,
} from "../types.js";

fetchMock.enableMocks();

describe("Supadata SDK", () => {
  const config = {
    apiKey: "test-api-key",
    baseUrl: "https://api.supadata.ai/v1",
  };
  let supadata: Supadata;

  beforeEach(() => {
    fetchMock.resetMocks();
    supadata = new Supadata(config);
  });

  describe("YouTube Service", () => {
    it("should get transcript", async () => {
      const mockResponse: Transcript = {
        content: [{ text: "Hello", offset: 0, duration: 1000, lang: "en" }],
        lang: "en",
        availableLangs: ["en"],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await supadata.youtube.transcript({ videoId: "test-id" });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.supadata.ai/v1/youtube/transcript?videoId=test-id",
        expect.objectContaining({
          method: "GET",
          headers: {
            "x-api-key": "test-api-key",
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should translate transcript", async () => {
      const mockResponse: TranslatedTranscript = {
        content: [{ text: "Hola", offset: 0, duration: 1000, lang: "es" }],
        lang: "es",
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await supadata.youtube.translate({
        videoId: "test-id",
        lang: "es",
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.supadata.ai/v1/youtube/transcript/translate?videoId=test-id&lang=es",
        expect.objectContaining({
          method: "GET",
          headers: {
            "x-api-key": "test-api-key",
            "Content-Type": "application/json",
          },
        })
      );
    });
  });

  describe("Web Service", () => {
    it("should scrape web content", async () => {
      const mockResponse: Scrape = {
        url: "https://supadata.ai",
        content: "# Title",
        name: "Example",
        description: "Test page",
        ogUrl: "https://supadata.ai/og.png",
        countCharacters: 100,
        urls: ["https://supadata.ai"],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await supadata.web.scrape("https://supadata.ai");
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.supadata.ai/v1/web/scrape?url=https%3A%2F%2Fsupadata.ai",
        expect.objectContaining({
          method: "GET",
          headers: {
            "x-api-key": "test-api-key",
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should map website", async () => {
      const mockResponse: Map = {
        urls: ["https://supadata.ai", "https://supadata.ai/docs"],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await supadata.web.map("https://supadata.ai");
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.supadata.ai/v1/web/map?url=https%3A%2F%2Fsupadata.ai",
        expect.objectContaining({
          method: "GET",
          headers: {
            "x-api-key": "test-api-key",
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should handle API errors", async () => {
      const errorResponse = {
        code: "invalid-request" as const,
        title: "Invalid Request",
        description: "The request was invalid",
        documentationUrl: "https://docs.supadata.ai/errors",
      };

      fetchMock.mockResponseOnce(JSON.stringify(errorResponse), {
        status: 400,
      });

      await expect(supadata.web.map("invalid-url")).rejects.toThrow();
    });
  });

  it("should initialize with config", () => {
    expect(supadata).toBeInstanceOf(Supadata);
  });
});
