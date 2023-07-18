# 命令行助手

用于命令行信息输出与控制

```ts
import { CommandOutput } from 'command-output';

const ui = new CommandOutput()
const p = ui.progress('进度条', 100);

let i = 0
const int = setInterval(() => {
  ui.log('asdasdsad ' + i++)
  // ui.footer(`底部测试{bold ${i}}`)
  p();
  if (i === 100) {
    clearInterval(int);
    ui.end();
  }
}, 100);
```
