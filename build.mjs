import { readFile,writeFile,mkdir,cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const config=JSON.parse(await readFile(path.join(root,'site-config.json'),'utf8'));
if(!config.brand?.name || !Array.isArray(config.work))throw new Error('Check site-config.json: brand and work are required.');
const dist=path.join(root,'dist');await mkdir(dist,{recursive:true});
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let html=await readFile(path.join(root,'src/index.html'),'utf8');
html=html.replace(/<title>.*?<\/title>/,`<title>${escape(config.brand.name)} — ${escape(config.brand.descriptor)}</title>`).replace('content="INKROOM — Independent tattoo atelier"',`content="${escape(config.brand.name)} — ${escape(config.brand.descriptor)}"`);
await writeFile(path.join(dist,'index.html'),html);
for(const name of ['styles.css','core.js','app.js'])await cp(path.join(root,'src',name),path.join(dist,name));
const serialize=obj=>JSON.stringify(obj).replace(/</g,'\\u003c');
await writeFile(path.join(dist,'config.js'),'window.STUDIO_CONFIG = '+serialize(config)+';\n');
await cp(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true});
await writeFile(path.join(dist,'robots.txt'),'User-agent: *\nDisallow: /\n');
// Self-contained offline preview: image copies are embedded into this deliverable.
const inlineConfig=structuredClone(config);
async function embedAsset(value){
 if(!value.startsWith('assets/') || value.split('/').includes('..'))throw new Error('Images must use a project assets/ path.');
 const ext=path.extname(value).slice(1).toLowerCase();
 const types={svg:'image/svg+xml',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',png:'image/png'};
 if(!types[ext])throw new Error('Unsupported image format: '+ext);
 return `data:${types[ext]};base64,${(await readFile(path.join(dist,value))).toString('base64')}`;
}
for(const key of Object.keys(inlineConfig.images))inlineConfig.images[key]=await embedAsset(inlineConfig.images[key]);
for(const work of inlineConfig.work)if(work.image)work.image=await embedAsset(work.image);
for(const artist of inlineConfig.artists)if(!['hero','portfolio'].includes(artist.image))artist.image=await embedAsset(artist.image);
const fontData=(await readFile(path.join(dist,'assets/studio-display.woff'))).toString('base64');
const css=(await readFile(path.join(dist,'styles.css'),'utf8')).replace('assets/studio-display.woff',`data:font/woff;base64,${fontData}`);
let preview=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>');
preview=preview.replace('<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">','');
preview=preview.replace('src="assets/studio-session.png"','src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4="');
preview=preview.replace('<script src="config.js" defer></script>','');
preview=preview.replace('<script src="core.js" defer></script>','');
preview=preview.replace('<script src="app.js" defer></script>','');
preview=preview.replace('</body>','<script>window.STUDIO_CONFIG='+serialize(inlineConfig)+';</script><script>'+await readFile(path.join(dist,'core.js'),'utf8')+'</script><script>'+await readFile(path.join(dist,'app.js'),'utf8')+'</script></body>');
await writeFile(path.join(root,'Tattoo-Studio-Preview.html'),preview);
console.log('Built dist/ and Tattoo-Studio-Preview.html (no external runtime dependencies).');
