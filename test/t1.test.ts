import { CommandOutput } from '../src';

const ui = new CommandOutput()
const p = ui.progress('进度条', 100);

let i = 0
const int = setInterval(() => {
  ui.log('asdasdsad ' + i++)
  // ui.footer(`底部测试`)
  p();
  if (i === 100) {
    clearInterval(int);
    ui.end();
  }
}, 100)
