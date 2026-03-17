import { describe, expect, it, beforeAll, afterAll, mock } from "bun:test";
import { createApp } from "@/app";

// PokeAPI モックレスポンス
const mockPikachuResponse = {
  id: 25,
  name: "pikachu",
  base_experience: 112,
  height: 4,
  is_default: true,
  order: 35,
  weight: 60,
  abilities: [
    {
      ability: { name: "static", url: "https://pokeapi.co/api/v2/ability/9/" },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: { name: "lightning-rod", url: "https://pokeapi.co/api/v2/ability/31/" },
      is_hidden: true,
      slot: 3,
    },
  ],
  forms: [{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-form/25/" }],
  game_indices: [],
  held_items: [],
  location_area_encounters: "https://pokeapi.co/api/v2/pokemon/25/encounters",
  moves: [],
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    back_default: null,
    front_shiny: null,
    back_shiny: null,
    other: {},
    versions: {},
  },
  species: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
  stats: [],
  types: [
    { slot: 1, type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" } },
  ],
  past_types: [],
};

describe("Integration Tests", () => {
  const originalFetch = global.fetch;
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    // fetchをモック化してPokeAPIへの外部通信を遮断
    // @ts-ignore
    global.fetch = mock((url: string, _opts?: RequestInit) => {
      if (typeof url === "string" && url.includes("pokeapi.co")) {
        const idMatch = url.match(/\/pokemon\/(\d+)$/);
        if (idMatch) {
          const id = parseInt(idMatch[1], 10);
          if (id === 25) {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve(mockPikachuResponse),
            });
          }
          if (id === 999 || id === 898) {
            return Promise.resolve({
              ok: false,
              status: 404,
              statusText: "Not Found",
              json: () => Promise.reject(new Error("Not found")),
            });
          }
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: () => Promise.reject(new Error("Server error")),
          });
        }
      }
      return originalFetch(url, _opts);
    });

    app = createApp();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  // --- Message エンドポイント ---

  describe("GET /message/:message", () => {
    it("メッセージを返す", async () => {
      const res = await app.request("/message/HelloWorld");

      expect(res.status).toBe(200);
      const body = await res.json() as any;
      expect(body.message).toBe("HelloWorld");
    });

    it("日本語メッセージも扱える", async () => {
      const res = await app.request(`/message/${encodeURIComponent("こんにちは")}`);

      expect(res.status).toBe(200);
      const body = await res.json() as any;
      expect(body.message).toBe("こんにちは");
    });
  });

  // --- Pokemon エンドポイント ---

  describe("GET /pokemon/:id", () => {
    it("正常にポケモン情報を取得する", async () => {
      const res = await app.request("/pokemon/25");

      expect(res.status).toBe(200);
      const body = await res.json() as any;
      expect(body.result.id).toBe(25);
      expect(body.result.name).toBe("pikachu");
      expect(body.result.types).toEqual(["electric"]);
    });

    it("レスポンスにstatusCodeやerrorフィールドがない形式で返る", async () => {
      const res = await app.request("/pokemon/25");

      expect(res.status).toBe(200);
      const body = await res.json() as any;
      expect(body.result).toBeDefined();
      expect(body.result.id).toBeNumber();
      expect(body.result.name).toBeString();
      expect(body.result.types).toBeArray();
    });

    it("存在しないポケモンIDで404エラーを返す", async () => {
      const res = await app.request("/pokemon/898");

      expect(res.status).toBe(404);
      const body = await res.json() as any;
      expect(body.status).toBe("error");
      expect(body.message).toBe("Resource not found");
    });

    it("範囲外のID (0以下) で400エラーを返す", async () => {
      const res = await app.request("/pokemon/0");

      expect(res.status).toBe(400);
      const body = await res.json() as any;
      expect(body.status).toBe("error");
    });

    it("範囲外のID (899以上) で400エラーを返す", async () => {
      const res = await app.request("/pokemon/899");

      expect(res.status).toBe(400);
      const body = await res.json() as any;
      expect(body.status).toBe("error");
    });

    it("数値でないIDで400エラーを返す", async () => {
      const res = await app.request("/pokemon/abc");

      expect(res.status).toBe(400);
      const body = await res.json() as any;
      expect(body.status).toBe("error");
    });

    it("小数のIDで400エラーを返す", async () => {
      const res = await app.request("/pokemon/2.5");

      expect(res.status).toBe(400);
      const body = await res.json() as any;
      expect(body.status).toBe("error");
    });

    it("外部API 500エラー時に500エラーを返す", async () => {
      const res = await app.request("/pokemon/500");

      expect(res.status).toBe(500);
      const body = await res.json() as any;
      expect(body.status).toBe("error");
    });
  });

  // --- 未定義ルート ---

  describe("未定義のルート", () => {
    it("存在しないパスで404を返す", async () => {
      const res = await app.request("/nonexistent");

      expect(res.status).toBe(404);
    });

    it("POSTメソッドに対して404を返す", async () => {
      const res = await app.request("/pokemon/25", { method: "POST" });

      expect(res.status).toBe(404);
    });
  });
});
