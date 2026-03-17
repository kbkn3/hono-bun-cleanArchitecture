import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
import type {
  PokemonGetByIdCondition,
  PokemonRepositoryDto,
} from "@/application/repositories/pokemon/pokemon.model";

/**
 * PokemonRepositoryのキャッシュDecorator
 * 横断的関心事であるキャッシュをリポジトリ実装から分離する
 */
export class CachingPokemonRepository implements PokemonRepository {
  private static readonly CACHE_TTL_MS = 60_000;
  private static readonly CACHE_MAX_SIZE = 200;
  private cache = new Map<number, { expiresAt: number; data: PokemonRepositoryDto }>();

  constructor(
    private delegate: PokemonRepository
  ) {}

  async getById(condition: PokemonGetByIdCondition): Promise<PokemonRepositoryDto> {
    const idNumber = condition.id.toNumber();
    const cached = this.cache.get(idNumber);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const result = await this.delegate.getById(condition);
    this.evictIfNeeded();
    this.cache.set(idNumber, {
      expiresAt: Date.now() + CachingPokemonRepository.CACHE_TTL_MS,
      data: result,
    });
    return result;
  }

  private evictIfNeeded(): void {
    if (this.cache.size <= CachingPokemonRepository.CACHE_MAX_SIZE) return;
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
      }
    }
    if (this.cache.size > CachingPokemonRepository.CACHE_MAX_SIZE) {
      const excess = this.cache.size - CachingPokemonRepository.CACHE_MAX_SIZE;
      const iterator = this.cache.keys();
      for (let i = 0; i < excess; i++) {
        const key = iterator.next().value;
        if (key !== undefined) this.cache.delete(key);
      }
    }
  }
}
