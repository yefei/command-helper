import * as chalk from 'chalk';
import { ETA } from './eta';

export class Progress {
  private _total: number;
  private _current: number;
  private _eta: ETA;
  private _barsize: number;
  private _barCompleteString: string;
  private _barIncompleteString: string;
  private _needUpdate: boolean;
  private _bar?: string;
  private _percentage?: number;

  constructor(total = 0, barsize = 50) {
    this._total = total;
    this._current = 0;
    this._eta = new ETA(total);
    this._barsize = barsize;
    this._barCompleteString = new Array(barsize + 1 ).join('=');
    this._barIncompleteString = new Array(barsize + 1 ).join(' ');
    this._update();
    this._needUpdate = false;
  }

  _update() {
    const progress = this._current / this._total;
    const b = this._barCompleteString.substr(0, Math.round(progress * this._barsize)) +
            this._barIncompleteString.substr(0, Math.round((1.0 - progress) * this._barsize));
    this._bar = b.substr(0, this._barsize);
    this._percentage = Math.floor(progress * 100);
    this._eta.update(this._current, this._total);
  }

  setTotal(total:number) {
    this._total = total;
    this._needUpdate = true;
  }

  text() {
    this._needUpdate && this._update();
    return chalk`{green ${this._current}/${this._total}} | [{blue ${this._bar}}] ${this._percentage}% | {yellow 预计: ${this._eta.getTime()}}`;
  }

  increment(current?: number) {
    if (current !== undefined) {
      this._current = current;
    } else {
      this._current++;
    }
    this._needUpdate = true;
  }
}
