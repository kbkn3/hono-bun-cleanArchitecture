import { describe, expect, it } from "bun:test";
import { PokemonGetByIdCondition } from "./pokemon.model";
import { PokemonId } from "../../../domain/pokemon/pokemon.id";

describe("PokemonRepository Models", () => {
  describe("PokemonGetByIdCondition", () => {
    it("正しい条件オブジェクトを作成できる", () => {
      const pokemonId = PokemonId.createRequired(25);
      const condition: PokemonGetByIdCondition = {
        id: pokemonId
      };
      
      expect(condition.id).toBe(pokemonId);
      expect(condition.id.toNumber()).toBe(25);
    });
  });
});
