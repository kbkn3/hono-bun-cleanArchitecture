# Hono Bun クリーンアーキテクチャ

## 説明

このプロジェクトは、HonoとBunを使用したクリーンアーキテクチャの実装例です。

## デモ

- `/:message` - パスパラメータのメッセージを返します。

  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/HelloWorld>
- `/pokemon/:id` - パスパラメータのIDに対応するポケモンを返します。

  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/pokemon/1>

## 技術スタック

- パッケージマネージャー: Bun
- データベース: なし
- HTTPサーバー: Hono
- テストフレームワーク: Bun
- リンター: Biome
- フォーマッター: Biome

## 開発

### セットアップ

1. Bunのインストール
  MacOS:

  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

  <https://bun.sh/docs/installation>

2. リポジトリのクローン

  ```bash
  git clone
  ```

3. 依存関係のインストール

  ```bash
  bun install
  ```

4. プロジェクトの実行

  ```bash
  bun dev
  ```

### デプロイ

```bash
bun run deploy
```

## Node.jsサポート

このプロジェクトはBunに加えてNode.jsでの実行もサポートしています：

### Node.js開発

```bash
npm run dev:node        # ホットリロード付きで実行
npm run start:node      # ホットリロードなしで実行
```

### ビルド

```bash
npm run build:node      # TypeScriptをJavaScriptにコンパイル
node dist/index.node.js # コンパイル済みバージョンを実行
```

### TypeScript設定

- `tsconfig.json` - Cloudflare Workers/Bun用のベース設定
- `tsconfig.node.json` - Node.js専用設定

## Dockerサポート

このプロジェクトはNode.jsとBun両方のランタイムに対応したDockerサポートを含んでいます。

### Node.jsでのDocker使用

1. **ビルドと実行**:

   ```bash
   npm run docker:build        # 本番イメージをビルド（コンパイル済みJS）
   npm run docker:run          # 本番コンテナを実行
   ```

2. **Docker Compose**:

   ```bash
   npm run docker:compose      # docker-composeで実行
   ```

### BunでのDocker使用

**✅ 更新**: TypeScriptインターフェースのエクスポート問題は、インターフェースに`import type`を使用することで解決されました。Bunはこのコードベースで正しく動作するようになりました。

Bunでビルドと実行：

1. Bun最適化イメージのビルドと実行：

   ```bash
   npm run docker:build:bun    # Bunイメージをビルド
   npm run docker:run:bun      # Bunコンテナを実行
   ```

2. デバッグモード（完全なBunイメージ使用）：

   ```bash
   docker build -t hono-bun-debug -f Dockerfile.bun --build-arg DEBUG=true .
   docker run -p 3000:3000 hono-bun-debug
   ```

### Docker Compose

プロジェクトにはNode.jsとBun両方の設定を含む`docker-compose.yml`ファイルが含まれています。デフォルトではNode.js本番バージョンを使用します。Bunバージョンを使用するには、`docker-compose.yml`ファイルを編集し、`app`サービスをコメントアウトして`app-bun`サービスのコメントを外してください。

アプリケーションは`http://localhost:3000`でアクセスできます。

## K6を使用したパフォーマンステスト

このプロジェクトには、パフォーマンス測定用のK6負荷テストスクリプトが含まれています。

📁 **完全なテストガイドと詳細情報については、[K6テストドキュメント](./k6-tests/README.md)をご覧ください。**

### クイックスタート

1. **K6をインストール**：

   ```bash
   brew install k6  # macOS
   ```

2. **自動比較を実行**：

   ```bash
   ./compare-performance.sh
   ```

### 利用可能なテストタイプ

- **スモークテスト** - 基本機能検証
- **シンプル負荷テスト** - 30秒間で5並行ユーザー
- **フル負荷テスト** - 2分間で10ユーザーまで段階的に増加
- **ストレステスト** - 最大200ユーザーまでの高負荷テスト

### パフォーマンス結果サマリー

BunとNode.jsの典型的なパフォーマンス比較：

- Bunで応答時間が**約40%高速**
- Bunでスループットが**約67%向上**

## TypeScriptインターフェース解決

Bunを使用する際は、TypeScriptインターフェースは`import type`を使用してインポートする必要があります：

```typescript
// ❌ Bunでエラーになります
import { PokemonRepository } from "@/application/repositories/pokemon/pokemon";

// ✅ Bunでの正しい方法
import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
```

これは、TypeScriptインターフェースが実行時に存在せず、Bunのモジュール解決が実行時のエクスポートを期待するためです。
