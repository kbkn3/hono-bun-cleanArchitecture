# K6 パフォーマンステストスイート

このディレクトリには、パフォーマンス分析とベンチマーク用の包括的なK6負荷テストスイートが含まれています。

## テストファイル

### 基本テスト

- **`k6-smoke-test.js`** - 基本機能検証用のスモークテスト
  - 30秒間で1仮想ユーザー
  - コアエンドポイントが動作していることを検証

- **`k6-simple-test.js`** - シンプルな負荷テスト
  - 30秒間で5並行ユーザー
  - 定期的なパフォーマンス監視に適している

### 高度なテスト

- **`k6-test.js`** - 段階的に負荷を上げるフル負荷テスト
  - ステージ：2ユーザー → 5ユーザー → 10ユーザー → 5ユーザー → 0ユーザー
  - 現実的な負荷パターンで2分間実行

- **`k6-stress-test.js`** - 高負荷ストレステスト
  - 最大200並行ユーザーまで負荷を上げる
  - 極限負荷下でのシステム限界と安定性をテスト

## 分析ツール

- **`analyze-k6-results.js`** - 結果分析ツール
  - K6のJSON出力ファイルを処理
  - 詳細なパフォーマンス指標とサマリーを生成

## 使用方法

### 前提条件

```bash
# K6をインストール
brew install k6  # macOS
# または https://k6.io/docs/getting-started/installation/ の手順に従ってください
```

### テストの実行

1. **サーバーを起動**（いずれかを選択）：

   ```bash
   # ローカル開発
   bun dev                    # Cloudflare Workers
   npm run dev:node          # Node.js（ホットリロード付き）

   # Docker
   npm run docker:run        # Node.js本番環境
   npm run docker:run:bun    # Bun本番環境
   ```

2. **K6テストを実行**：

   ```bash
   # 基本スモークテスト
   k6 run k6-tests/k6-smoke-test.js

   # シンプル負荷テスト
   k6 run k6-tests/k6-simple-test.js

   # フル負荷テスト
   k6 run k6-tests/k6-test.js

   # ストレステスト
   k6 run k6-tests/k6-stress-test.js
   ```

3. **結果を保存して分析**：

   ```bash
   # 結果をJSONに保存
   k6 run --out json=results.json k6-tests/k6-simple-test.js

   # 結果を分析
   node k6-tests/analyze-k6-results.js results.json
   ```

### 自動パフォーマンス比較

自動テスト用のルートレベル比較スクリプトを使用：

```bash
./compare-performance.sh
```

このスクリプトは以下を実行します：

- Node.jsとBun両方の実装に対してテストを実行
- `performance-results/`ディレクトリにタイムスタンプ付きで結果を保存
- パフォーマンス比較を表示

## テスト設定

### ベースURL

テストはデフォルトで`http://localhost:3000`を使用します。環境変数で上書き可能：

```bash
BASE_URL=http://localhost:8080 k6 run k6-tests/k6-simple-test.js
```

### テストエンドポイント

すべてのテストは以下のエンドポイントを検証します：

- `GET /hello` - 基本ヘルスチェック
- `GET /pokemon/1` - Pokemon API統合
- `GET /pokemon/25` - 追加Pokemonテスト（ピカチュウ）

### パフォーマンス閾値

テストには組み込みのパフォーマンス閾値が含まれています：

- リクエストの95%が500ms以内に完了する必要がある
- HTTPエラー率は1%未満である必要がある
- 平均応答時間は200ms未満である必要がある

## 期待されるパフォーマンス指標

### Node.js（Docker）

- **平均応答時間**：~25ms
- **95パーセンタイル**：~65ms
- **スループット**：~200リクエスト/秒
- **総リクエスト数**：~6,000（30秒テスト）

### Bun（ローカル）

- **平均応答時間**：~15ms
- **95パーセンタイル**：~32ms
- **スループット**：~334リクエスト/秒
- **総リクエスト数**：~10,000（30秒テスト）

**パフォーマンス向上**：Bunは通常、応答時間が約40%高速で、スループットが約67%向上します。

## トラブルシューティング

### よくある問題

1. **接続拒否**
   - サーバーが正しいポートで実行されていることを確認
   - BASE_URL環境変数を確認

2. **高いエラー率**
   - Pokemon APIにアクセス可能であることを確認
   - SSL証明書設定を確認（開発用：NODE_TLS_REJECT_UNAUTHORIZED=0）

3. **一貫しない結果**
   - 複数回のテスト実行
   - テスト中にシステムが他の負荷を受けていないことを確認
   - 一貫した環境のためにDockerを使用

### SSL証明書の問題

自己署名証明書での開発用：

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

## CI/CDとの統合

これらのテストは自動化パイプラインに統合できます：

```yaml
# GitHub Actionsステップの例
- name: Run K6 Performance Tests
  run: |
    docker run -d -p 3000:3000 --name test-app hono-node-app
    k6 run --out json=results.json k6-tests/k6-simple-test.js
    node k6-tests/analyze-k6-results.js results.json
```

## 貢献

新しいテストを追加する際は：

1. 既存の命名規則に従ってください：`k6-{test-type}-test.js`
2. 適切な閾値とチェックを含める
3. このREADMEにドキュメントを追加
4. Node.jsとBun両方の実装に対してテストする