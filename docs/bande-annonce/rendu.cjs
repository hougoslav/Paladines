const { chromium } = require(process.env.PW);
const fs = require("fs");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto("file://"+__dirname+"/bande-annonce.html"); await p.waitForTimeout(1000);
fs.mkdirSync(__dirname+"/images",{recursive:true});
const N = 64*30;
for (let f=0; f<N; f++) {
  await p.evaluate(t=>rendre(t), f/30);
  if (f % 30 === 0) await p.waitForTimeout(30);
  await p.screenshot({path:__dirname+`/images/${String(f).padStart(5,"0")}.jpg`, type:"jpeg", quality:93});
  if (f % 300 === 0) console.log("image", f);
}
console.log("fini"); await b.close();})();
