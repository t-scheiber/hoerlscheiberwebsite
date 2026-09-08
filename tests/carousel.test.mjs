import assert from 'node:assert/strict';
import {test} from 'node:test';
import {act,applicationModule,render} from './component-harness.mjs';
const {default:Carousel}=await applicationModule('app/components/ImageCarousel.tsx');
const images=['/photo-a.jpg','/photo-b.jpg','/photo-c.jpg'];
const hero=ui=>ui.container.querySelector('img[alt^="Wedding photo"]');
const button=(ui,label)=>ui.container.querySelector(`button[aria-label="${label}"]`);

test('carousel arrows wrap and thumbnails select the matching image',{timeout:5000},async t=>{
 const ui=await render(t,Carousel,{images});
 assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 1');
 await ui.click(button(ui,'Previous image'));assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 3');
 await ui.click(button(ui,'Next image'));assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 1');
 await ui.click(ui.container.querySelector('img[alt="Thumbnail 2"]').closest('button'));
 assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 2');assert.match(hero(ui).getAttribute('src'),/photo-b/);
});

test('autoplay advances on schedule and pause/resume controls the timer',{timeout:5000},async t=>{
 t.mock.timers.enable({apis:['setInterval']});
 const ui=await render(t,Carousel,{images,autoPlayInterval:1000});
 await act(async()=>t.mock.timers.tick(999));assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 1');
 await act(async()=>t.mock.timers.tick(1));assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 2');
 await ui.click(button(ui,'Pause slideshow'));await act(async()=>t.mock.timers.tick(3000));assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 2');
 await ui.click(button(ui,'Play slideshow'));await act(async()=>t.mock.timers.tick(1000));assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 3');
});

test('unmount clears the slideshow interval',{timeout:5000},async t=>{
 const timer={fixture:true};const created=t.mock.method(globalThis,'setInterval',()=>timer);const cleared=t.mock.method(globalThis,'clearInterval',()=>{});
 const ui=await render(t,Carousel,{images});assert.equal(created.mock.callCount(),1);
 await ui.unmount();assert.equal(cleared.mock.callCount(),1);assert.equal(cleared.mock.calls[0].arguments[0],timer);
});

test('shrinking the photo list keeps the current selection valid immediately',{timeout:5000},async t=>{
 const ui=await render(t,Carousel,{images});await ui.click(button(ui,'Previous image'));
 await ui.update({images:[images[0]]});assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 1');assert.match(hero(ui).getAttribute('src'),/photo-a/);assert.doesNotMatch(ui.container.textContent,/3\s*\/\s*1/);
});

test('an empty carousel renders an accessible fallback without invalid image sources or timers',{timeout:5000},async t=>{
 const timer=t.mock.method(globalThis,'setInterval');
 const ui=await render(t,Carousel,{images:[]});
 assert.equal(ui.container.querySelector('img'),null);assert.ok(ui.container.querySelector('[role="status"]'));assert.equal(timer.mock.callCount(),0);
});

test('one image stays selected and does not create an unnecessary autoplay interval',{timeout:5000},async t=>{
 const timer=t.mock.method(globalThis,'setInterval');
 const ui=await render(t,Carousel,{images:[images[0]]});assert.equal(timer.mock.callCount(),0);
 const next=button(ui,'Next image');if(next)await ui.click(next);
 assert.equal(hero(ui).getAttribute('alt'),'Wedding photo 1');
});
