import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import http from 'node:http';
import {setTimeout as delay} from 'node:timers/promises';
import {test} from 'node:test';

test('the production server serves the homepage, health, gallery assets and image optimization', {timeout: 120000}, async t => {
  assert.ok(existsSync('.next/BUILD_ID'), 'production build exists');
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '4328'], {
    env: {PATH: process.env.PATH, HOME: '/tmp', NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', HOSTNAME: '127.0.0.1', PORT: '4328'},
    stdio: 'ignore',
  });
  const closed = once(server, 'close');
  t.after(async () => {
    server.kill('SIGTERM');
    const timer = setTimeout(() => server.kill('SIGKILL'), 3000);
    try {await closed;} finally {clearTimeout(timer);}
  });
  function get(url, maxBytes = 2 * 1024 * 1024) {
    assert.ok(maxBytes <= 12500000);
    assert.ok(url.startsWith('/') && !url.startsWith('//') && !/[\r\n]/.test(url));
    return new Promise((resolve, reject) => {
      const request = http.get({hostname: '127.0.0.1', port: 4328, path: url, timeout: 3000}, response => {
        const parts = []; let size = 0;
        response.on('data', chunk => {size += chunk.length; if (size > maxBytes) response.destroy(Error('Response exceeds test budget')); else parts.push(chunk);});
        response.on('end', () => resolve({status: response.statusCode, headers: response.headers, bytes: Buffer.concat(parts)}));
        response.on('error', reject);
      });
      request.on('timeout', () => request.destroy(Error('Loopback request timed out')));
      request.on('error', reject);
    });
  }
  let home;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw Error('Production server exited before readiness');
    try {home = await get('/'); break;} catch {await delay(100);}
  }
  assert.equal(home?.status, 200);
  const html = home.bytes.toString();
  assert.match(html, /<h1\b/);
  const health = await get('/api/health');
  assert.equal(health.status, 200);assert.match(health.headers['content-type'], /application\/json/);
  assert.deepEqual(JSON.parse(health.bytes), {status:'ok', message:'App is up and running'});
  assert.equal(home.headers['x-powered-by'], undefined);
  const assets = new Set([...html.matchAll(/(?:src|href)="([^"<>]+)"/g)].map(match => match[1].replaceAll('&amp;', '&')).filter(url => url.startsWith('/_next/')));
  assert.ok(assets.size >= 3, 'production page references bundled scripts and styles');
  for (const asset of assets) {
    const response = await get(asset);
    assert.equal(response.status, 200, 'bundled asset is served');
    assert.ok(response.bytes.length > 0);
    assert.doesNotMatch(response.headers['content-type'] || '', /text\/html/);
  }
  const source = readFileSync('app/page.tsx','utf8');
  const photos = [...source.matchAll(/"(\/galleryimages\/[^"\r\n]+)"/g)].map(match=>match[1]);
  assert.equal(photos.length,25);assert.equal(new Set(photos).size,25);
  for(const photo of photos) {
    const original=readFileSync('public'+photo),served=await get(encodeURI(photo),12500000);
    assert.equal(served.status,200);assert.match(served.headers['content-type'],/image\/jpeg/);
    assert.equal(createHash('sha256').update(served.bytes).digest('hex'),createHash('sha256').update(original).digest('hex'));
  }
  const smallest=photos.toSorted((a,b)=>readFileSync('public'+a).length-readFileSync('public'+b).length)[0];
  const optimized=await get('/_next/image?url='+encodeURIComponent(smallest)+'&w=640&q=75');
  assert.equal(optimized.status,200);assert.match(optimized.headers['content-type'],/image\/(?:jpeg|webp|avif)/);assert.ok(optimized.bytes.length>0);
  for(const quality of [60,85])assert.equal((await get('/_next/image?url='+encodeURIComponent(smallest)+'&w=640&q='+quality)).status,200,'the application image qualities are supported');
  assert.equal((await get('/maintenance-missing-route')).status, 404);
});
