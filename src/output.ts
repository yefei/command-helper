import * as chalk from 'chalk';
import * as moment from 'moment';
import * as columnify from 'columnify';
import { secondsToTime } from './utils';
import { Progress } from './progress';

const PROGRESS = Symbol('ui#progress');

export class CommandOutput {
  lastDraw: string;
  stream: NodeJS.WriteStream;
  startTime: number;
  [PROGRESS]?: Progress;

  constructor() {
    this.lastDraw = '';
    this.stream = process.stderr;
    this.startTime = Date.now();
  }

  /**
   * 显示结束信息
   */
  end() {
    const t = secondsToTime(Math.floor((Date.now() - this.startTime) / 1000));
    this.log(`耗时: ${t}`);
  }

  /**
   * 输出一行内容
   * @param args 
   */
  line(...args: any[]) {
    if (this.stream.isTTY) {
      this.stream.clearLine(-1);
      this.stream.cursorTo(0);
    }
    this.stream.write(args.join(' '));
    this.stream.write('\n');
    this.stream.write(this.lastDraw);
  }

  /**
   * 输出一行日志
   * @param args 
   */
  log(...args: any[]) {
    this.line(chalk`{gray [${moment().format('YYYY-MM-DD h:mm:ss')}]} ` + args.join(' '));
  }

  /**
   * 输出表格数据
   * @param list 
   */
  table(list: any[]) {
    this.line(columnify(list, {
      columnSplitter: ' | ',
    }));
  }

  /**
   * 设置底部文字
   * @param text 
   * @returns 
   */
  footer(text:string) {
    if (this.lastDraw === text) return;
    this.stream.isTTY && this.stream.cursorTo(0);
    this.stream.write(text);
    this.stream.isTTY && this.stream.clearLine(1);
    this.lastDraw = text;
  }

  /**
   * 设置进度条
   * @param name 名称
   * @param total 总数
   * @returns 进度条更新函数
   */
  progress(name:string, total:number) {
    const p = this[PROGRESS] = new Progress(total);
    const update = () => this.footer(`${name} | ${p.text()}`);
    update();
    return (current?: number) => {
      p.increment(current);
      update();
    };
  }

  /**
   * 设置进度条总数
   * @param total 
   */
  processSetTotal(total:number) {
    if (this[PROGRESS]) {
      this[PROGRESS].setTotal(total);
    } else {
      this[PROGRESS] = new Progress(total);
    }
  }
}
