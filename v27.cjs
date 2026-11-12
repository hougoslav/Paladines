const { chromium } = require(process.env.PW);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},serviceWorkers:"block"});
const p=await ctx.newPage();const err=[];p.on("pageerror",e=>err.push(e.message));
await p.route(/openfreemap|openstreetmap|open-meteo|api\/|geopf|data.gouv/, r=>r.abort());
await p.addInitScript(()=>localStorage.setItem("paladines.langue",'"fr"'));
for (const v of ["accueil","cat-manger","pourvous","cat-droits","lieu-l196","lieu-l64"]) { await p.goto("http://localhost:8787/#"+v); await p.waitForTimeout(600); await p.screenshot({path:"r10-"+v+".png"}); }
console.log(await p.evaluate(()=>document.querySelector("#vue").innerText.slice(0,200)));
await p.goto("http://localhost:8787/#cat-manger"); await p.waitForTimeout(500);
console.log("manger:", await p.evaluate(()=>document.querySelectorAll("#resultats .lieu, #resultats li").length));
console.log("erreurs",err); await b.close();
require("child_process").execFileSync("python3",["montage.py","m-v27.png","r10-accueil.png","r10-cat-manger.png","r10-pourvous.png","r10-lieu-l196.png","r10-lieu-l64.png"]);})();
