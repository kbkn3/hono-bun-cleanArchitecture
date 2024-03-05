import { inject, injectable } from "inversify";
import { Context } from "hono";
import { BaseController } from "./base.controller";

export type BodyParams = {
  message: string;
};

@injectable()
export class HelloWorldController implements BaseController {
  constructor(
  ) {}

  async main(c: Context) {
    /**
     * Request オブジェクトから必要なパラメータを抽出しValue Objectなどアプリケーション内で扱いやすい形に変換する。
     * ロジックの分散を防ぐため各ページパターンごとにforwardingする前のこのcontrollerに変換処理をまとめ、
     * forwardingした先では必要な値をこのparamsから参照して利用すること。
     */
    const params = this.convertRequestToParams(c);
    return await this.mainFn(c, params);
  }

    /**
   * Context オブジェクトは Presenter や UseCase など、Controller 以外のモジュールには引き渡しは禁止です
   * 何等かのデータ形式に依存したコードを様々なモジュールで利用すると、他のフレームワークへの移行を余儀なくされる際に、
   * プロダクトコードへの修正が大量に必要となり、実質修正ができなくなってしまうためです。
   * フレームワークのインターフェース（RequestやResponseなど）を触るのは、controllerだけに絞り、
   * その他のモジュール（usecase, presenterなど）にデータを渡す時には、
   * それらの値をまとめるインターフェースを定義し、そこにデータを詰めるという方法を採用します。
   */
  private async mainFn(c: Context, params: BodyParams) {
    return c.json({ message: params.message });
  }

  private convertRequestToParams(c: Context): BodyParams {
    const message = c.req.param('message');
    return {
      message: message,
    };
  }
}
