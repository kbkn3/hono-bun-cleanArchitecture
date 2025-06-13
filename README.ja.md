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

### インストール

```bash
brew install k6
```

### 利用可能なテスト

1. **スモークテスト** - 基本的な機能チェック

   ```bash
   k6 run k6-smoke-test.js
   ```

2. **シンプル負荷テスト** - 5並行ユーザーで30秒間

   ```bash
   k6 run k6-simple-test.js
   ```

3. **フル負荷テスト** - 2分間で10ユーザーまで徐々に増加

   ```bash
   k6 run k6-test.js
   ```

4. **ストレステスト** - 最大200ユーザーまでの高負荷テスト

   ```bash
   k6 run k6-stress-test.js
   ```

### Dockerでのテスト実行

```bash
# サーバーを起動
docker run -d -p 3000:3000 --name test-server hono-bun-app

# K6テストを実行
k6 run k6-simple-test.js

# 結果をJSONに保存
k6 run --out json=results.json k6-simple-test.js

# 結果を分析
node analyze-k6-results.js results.json
```

### 自動パフォーマンス比較

付属のスクリプトを使用してNode.jsとBunのパフォーマンスを比較：

```bash
./compare-performance.sh
```

このスクリプトは以下を実行します：

- Node.jsとBun両方のサーバーを起動
- 両方に対してK6テストを実行
- タイムスタンプ付きで結果を保存
- 比較を表示

### パフォーマンス結果

5並行ユーザーで30秒間の典型的なパフォーマンス指標：

#### Node.js (Docker)

- **平均応答時間**: ~25ms
- **95パーセンタイル**: ~65ms
- **スループット**: ~200リクエスト/秒
- **総リクエスト数**: ~6,000

#### Bun (ローカル)

- **平均応答時間**: ~15ms
- **95パーセンタイル**: ~32ms
- **スループット**: ~334リクエスト/秒
- **総リクエスト数**: ~10,000

**Bunでのパフォーマンス向上**: 応答時間が約40%高速、スループットが約67%向上

## TypeScriptインターフェース解決

Bunを使用する際は、TypeScriptインターフェースは`import type`を使用してインポートする必要があります：

```typescript
// ❌ Bunでエラーになります
import { PokemonRepository } from "@/application/repositories/pokemon/pokemon";

// ✅ Bunでの正しい方法
import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
```

これは、TypeScriptインターフェースが実行時に存在せず、Bunのモジュール解決が実行時のエクスポートを期待するためです。