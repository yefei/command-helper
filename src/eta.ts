import { secondsToTime } from './utils';

// 预计剩余时间计算
export class ETA {
  etaBufferLength: number;
  valueBuffer: number[];
  timeBuffer: number[];
  eta: string;

  constructor(length = 100, initTime = Date.now(), initValue = 0) {
    // size of eta buffer
    this.etaBufferLength = length;
    // eta buffer with initial values
    this.valueBuffer = [initValue];
    this.timeBuffer = [initTime];
    // eta time value
    this.eta = '0';
  }

  // add new values to calculation buffer
  update(value:number, total:number) {
    this.valueBuffer.push(value);
    this.timeBuffer.push(Date.now());
    // trigger recalculation
    this.calculate(total - value);
  }

  // fetch estimated time
  getTime() {
    return this.eta;
  }

  // eta calculation - request number of remaining events
  calculate(remaining:number) {
    // get number of samples in eta buffer
    const currentBufferSize = this.valueBuffer.length;
    const buffer = Math.min(this.etaBufferLength, currentBufferSize);

    const v_diff = this.valueBuffer[currentBufferSize - 1] - this.valueBuffer[currentBufferSize - buffer];
    const t_diff = this.timeBuffer[currentBufferSize - 1] - this.timeBuffer[currentBufferSize - buffer];

    // get progress per ms
    const vt_rate = v_diff / t_diff;

    // strip past elements
    this.valueBuffer = this.valueBuffer.slice(-this.etaBufferLength);
    this.timeBuffer = this.timeBuffer.slice(-this.etaBufferLength);

    // eq: vt_rate *x = total
    const eta = Math.ceil(remaining / vt_rate / 1000);

    // check values
    if (isNaN(eta)) {
      this.eta = 'NULL';
      // +/- Infinity --- NaN already handled
    } else if (!isFinite(eta)) {
      this.eta = 'INF';
      // > 100k s ?
    } else if (eta > 100000) {
      this.eta = 'INF';
    } else {
      // assign
      this.eta = secondsToTime(eta);
    }
  }
}
