// Run SSR in its own process, matching the separation between a server and browser.
import {renderToReadableStream} from 'react-dom/server';
import {applicationModule,applicationView} from './component-harness.mjs';
Math.random=()=>0.9;
const {default:Home}=await applicationModule('app/page.tsx');
const stream=await renderToReadableStream(applicationView(Home));await stream.allReady;
const html=await new Response(stream).text();
if(Buffer.byteLength(html)>2*1024*1024)throw Error('Server rendering exceeds test budget');
process.stdout.write(html);
