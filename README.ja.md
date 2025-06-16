# Hono Bun クリーンアーキテクチャ

[📊 パフォーマンス分析](./docs/PERFORMANCE_ANALYSIS_COMPLETE.ja.md)

## 説明

HonoフレームワークとBunおよびNode.jsランタイムの両方をサポートするクリーンアーキテクチャの実装です。このプロジェクトは、Dockerデプロイメントと包括的なパフォーマンステストを備えたモダンなTypeScript開発を実証しています。

## デモ

- `/:message` - パスパラメータのメッセージを返します。
  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/HelloWorld>
- `/pokemon/:id` - パスパラメータのIDに対応するポケモンを返します。
  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/pokemon/1>

## 機能

- 🏗️ **クリーンアーキテクチャ** - 明確な依存関係の境界を持つ関心の分離
- 🚀 **デュアルランタイムサポート** - BunとNode.jsの両方で動作
- 🐳 **Docker対応** - 本番対応のコンテナ化
- 📊 **パフォーマンステスト** - 包括的なK6負荷テストスイート
- 🔧 **TypeScript** - モダンなTS機能による完全な型安全性
- ✨ **ホットリロード** - 高速な開発体験

## 技術スタック

- **パッケージマネージャー**: Bun
- **HTTPサーバー**: Hono
- **テストフレームワーク**: Bun
- **リンター/フォーマッター**: Biome
- **コンテナ化**: Docker & Docker Compose
- **パフォーマンステスト**: K6

## クイックスタート

### 前提条件

- [Bun](https://bun.sh/docs/installation)（推奨）またはNode.js 20+
- Docker（コンテナ化デプロイメント用、オプション）

### セットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd hono-bun-cleanArchitecture

# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev
```

アプリケーションは`http://localhost:3000`で利用できます。

## 開発

### 利用可能なスクリプト

```bash
# 開発
bun dev                 # Bunで開始（推奨）
npm run dev:node        # Node.jsで開始

# 本番
bun run deploy          # Cloudflare Workersにデプロイ
npm run start:node      # Node.js本番サーバーの実行

# テスト
bun test                # テスト実行
bun test:watch          # ウォッチモードでテスト実行
bun test:coverage       # カバレッジ付きテスト実行

# コード品質
bun run lint            # リンターの実行
bun run format          # コードフォーマット
bun run typecheck       # 型チェック
```

## Dockerデプロイメント

### Node.js（本番環境推奨）

```bash
npm run docker:build    # 本番イメージのビルド
npm run docker:run      # コンテナの実行
```

### Bun

```bash
npm run docker:build:bun # Bunイメージのビルド
npm run docker:run:bun   # Bunコンテナの実行
```

### Docker Compose

```bash
npm run docker:compose   # docker-composeで実行
```

## パフォーマンステスト

このプロジェクトには、K6による包括的なパフォーマンステストが含まれています。

### クイックパフォーマンステスト

```bash
# K6のインストール
brew install k6  # macOS

# パフォーマンス比較の実行
./compare-performance.sh
```

### パフォーマンスサマリー

広範囲なテスト（ローカル、Docker、統計分析）に基づく結果：

| 環境 | 最適ランタイム | 主要な利点 |
|------|---------------|-----------|
| **ローカル開発** | Bun | 4.3%高速、より良い開発者体験 |
| **Docker本番** | Node.js | より一貫性があり信頼性の高い性能 |
| **総合推奨** | 文脈依存 | [完全分析](./docs/PERFORMANCE_ANALYSIS_COMPLETE.ja.md)を参照 |

📊 **[完全パフォーマンス分析](./docs/PERFORMANCE_ANALYSIS_COMPLETE.ja.md)** - 統計的有意性テストを含む詳細比較。

🧪 **[K6テストガイド](./k6-tests/README.ja.md)** - 包括的なテストドキュメント。

## アーキテクチャ

このプロジェクトはクリーンアーキテクチャの原則に従います：

- **ドメイン層** (`src/domain/`) - 純粋なビジネスロジック
- **アプリケーション層** (`src/application/`) - ユースケースとインターフェース
- **アダプター層** (`src/adapters/`) - 外部統合
- **インフラストラクチャ層** - フレームワーク固有のコード

主要パターン：

- 依存性注入（InversifyJS）
- リポジトリパターン
- 値オブジェクト
- ドメインエラーハンドリング

## 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成
3. テストとリンティングを実行
4. プルリクエストを提出

## ドキュメント

- [📊 パフォーマンス分析](./docs/PERFORMANCE_ANALYSIS_COMPLETE.ja.md) - 完全なランタイム比較
- [🧪 K6テストガイド](./k6-tests/README.ja.md) - 負荷テストドキュメント
- [🤖 Claude.md](./CLAUDE.md) - AIアシスタントガイドライン

## ライセンス

このプロジェクトはデモンストレーション目的です。
