const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9222;

  // 1. Launch Chrome with CDP
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1200,900',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  // Wait 1.5s for Chrome to start
  await new Promise(r => setTimeout(r, 1500));

  try {
    // 2. Get WebSocket debugger URL from http://127.0.0.1:9222/json/version
    const res = await fetch(`http://127.0.0.1:${port}/json/version`);
    const data = await res.json();
    const wsUrl = data.webSocketDebuggerUrl;
    console.log('Connected to Chrome CDP:', wsUrl);

    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const resp = JSON.parse(evt.data);
          if (resp.id === msgId) {
            ws.removeEventListener('message', handler);
            if (resp.error) reject(resp.error);
            else resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // 3. Create new target page
    const { targetId } = await send('Target.createTarget', { url: 'file:///C:/Users/kitti/Downloads/New folder/index.html' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const resp = JSON.parse(evt.data);
          if (resp.id === msgId) {
            ws.removeEventListener('message', handler);
            if (resp.error) reject(resp.error);
            else resolve(resp.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
      });
    }

    await sendSession('Page.enable');
    await sendSession('Runtime.enable');

    // Wait for page to load
    await new Promise(r => setTimeout(r, 2000));

    // 4. Trigger Start Game, then trigger showQuestFailed()
    await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const btnStart = document.getElementById('btn-title-start');
          if (btnStart) btnStart.click();
          switchMode('battle');
          showQuestFailed();
        })()
      `
    });

    // Wait 1.2s for animations
    await new Promise(r => setTimeout(r, 1200));

    // 5. Capture screenshot
    const { data: b64 } = await sendSession('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(b64, 'base64');
    fs.writeFileSync('c:/Users/kitti/Downloads/New folder/game_over_scene.png', buffer);
    fs.writeFileSync('c:/Users/kitti/Downloads/New folder/quest_failed_screen.png', buffer);
    console.log('Saved game_over_scene.png and quest_failed_screen.png successfully!');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

main();
