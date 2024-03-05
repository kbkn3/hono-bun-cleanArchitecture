import { Context } from "hono";

export type Route = {
  /** ルート名 */
  name: string;
  /** サービス名 */
  serviceName: symbol;
  /** 受け入れるメソッド */
  methods: Method[];
  /** ルートのパス */
  path: string;
};

type Method = 'get' | 'post';

export interface BaseController {
  /**
   * @param $route - ルートデータ
   * @param $req - リクエストオブジェクト
   * @param $res - レスポンスオブジェクト
   */
  main(c: Context): Promise<any>;
}
