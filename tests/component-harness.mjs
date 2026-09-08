import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import ts from 'typescript';
import {JSDOM} from 'jsdom';
import React, {act} from 'react';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {default: ImageContextModule} = await import('next/dist/shared/lib/image-config-context.shared-runtime.js');
const {default: ImageDefaultsModule} = await import('next/dist/shared/lib/image-config.js');
const ImageConfigContext = ImageContextModule.ImageConfigContext;
const compiled = path.join(root, 'tests', '.compiled', String(process.pid));
const completed = new Map();

async function compile(relative) {
  if (completed.has(relative)) return completed.get(relative);
  assert.match(relative, /^(?:app\/(?:components\/)?[A-Za-z0-9_-]+\.(?:ts|tsx)|next\.config\.ts)$/);
  const output = path.join(compiled, relative.replace(/\.tsx?$/, '.mjs'));
  completed.set(relative, output);
  const input = await fs.readFile(path.join(root, relative), 'utf8');
  let code = ts.transpileModule(input, {fileName: relative, compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX,
  }}).outputText;
  code = code.replace(/import\s+(\w+)\s+from\s+["']next\/image["'];?/, (_, local) =>
    `import NextImageModule from 'next/image.js'; const ${local} = NextImageModule.default ?? NextImageModule;`);
  const imports = [...code.matchAll(/from\s+(["'])(@\/[^"']+|\.\.?\/[^"']+)\1/g)];
  for (const match of imports) {
    const target = match[2].startsWith('@/') ? match[2].slice(2) : path.posix.normalize(path.posix.join(path.posix.dirname(relative), match[2]));
    if (target === 'package.json') {
      code = code.replace(match[0], `from ${JSON.stringify(pathToFileURL(path.join(root, target)).href)} with {type: 'json'}`);
      continue;
    }
    let found;
    for (const suffix of ['.tsx', '.ts']) {
      try { await fs.access(path.join(root, target + suffix)); found = target + suffix; break; } catch {continue;}
    }
    assert.ok(found, 'local component import must resolve to inspected application source');
    const destination = await compile(found);
    code = code.replace(match[0], 'from ' + JSON.stringify(pathToFileURL(destination).href));
  }
  await fs.mkdir(path.dirname(output), {recursive: true});
  await fs.writeFile(output, code);
  return output;
}

export async function applicationModule(relative) {
  return import(pathToFileURL(await compile(relative)).href);
}

const {default: nextConfig} = await applicationModule('next.config.ts');
const imageConfig = {...ImageDefaultsModule.imageConfigDefault, ...nextConfig.images};
export const applicationView = (Component, props = {}) => React.createElement(ImageConfigContext.Provider, {value: imageConfig}, React.createElement(Component, props));

export async function render(t, Component, props = {}) {
  // jsdom does not load subresources or execute embedded scripts by default.
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {url: 'https://fixture.invalid/'});
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  dom.window.HTMLElement.prototype.scrollTo = () => {};
  const globals = {window: dom.window, document: dom.window.document, navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true};
  const previous = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, {value, configurable: true, writable: true});
  const {createRoot} = await import('react-dom/client');
  const container = dom.window.document.getElementById('root');
  const mounted = createRoot(container);
  t.after(async () => {
    await act(async () => mounted.unmount());
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  await act(async () => mounted.render(applicationView(Component, props)));
  return {
    document: dom.window.document, window: dom.window, container,
    click: element => act(async () => element.dispatchEvent(new dom.window.MouseEvent('click', {bubbles: true}))),
    key: key => act(async () => dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key}))),
    error: element => act(async () => element.dispatchEvent(new dom.window.Event('error'))),
    unmount: () => act(async () => mounted.unmount()),
    update: updated => act(async () => mounted.render(applicationView(Component, updated))),
  };
}

export {act};
