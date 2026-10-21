(function(root){
 'use strict';
 const norm=x=>String(x??'').toLowerCase().trim();
 const numeric=x=>x===null||x===undefined||x===''?null:Number.isFinite(Number(x))?Number(x):null;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const locationNames={L1:'L1 历史强来源支持',L2:'L2 历史较低特异性支持',L3:'L3 历史提示性支持',L0:'L0 未解决'};
 const route=g=>g.ppi>0&&g.molecular>0?'both':g.ppi>0?'ppi':g.molecular>0?'molecular':'none';
 const filterGenes=(genes,f={})=>{
  const qs=norm(f.q).split(/\s+/).filter(Boolean);
  return genes.filter(g=>(!f.reviewCat||g.reviewCat===f.reviewCat)&&(!f.status||g.status===f.status)&&(!f.loc||g.loc===f.loc)&&(!f.family||g.family===f.family)&&(!f.route||route(g)===f.route)&&(!f.saved||f.saved.has(g.symbol))&&
   (numeric(f.maxLength)===null||(numeric(g.length)!==null&&g.length<=Number(f.maxLength)))&&(!f.lab||g.labOverlap)&&qs.every(q=>norm(g.searchText).includes(q)));
 };
 const sortGenes=(rows,key='family',direction='asc')=>{
  const cmp=(a,b)=>String(a).localeCompare(String(b),'en',{numeric:true,sensitivity:'base'});
  const value=g=>({family:g.family,original:g.originalOrder,symbol:g.symbol,ppi:g.ppi,molecular:g.molecular,pubmed:g.pubmed,length:g.length,score:g.score,loc:g.loc})[key];
  return [...rows].sort((a,b)=>{
   const x=value(a),y=value(b);let d;
   if(x===null||x===undefined)d=y===null||y===undefined?0:1;
   else if(y===null||y===undefined)d=-1;
   else d=typeof x==='number'&&typeof y==='number'?x-y:cmp(x,y);
   if(x!==null&&x!==undefined&&y!==null&&y!==undefined&&direction==='desc')d=-d;
   return d||cmp(a.symbol,b.symbol);
  });
 };
 const paginate=(rows,page=1,size=25)=>{const pages=Math.max(1,Math.ceil(rows.length/size));const current=Math.max(1,Math.min(page,pages));return {rows:rows.slice((current-1)*size,current*size),page:current,pages,total:rows.length};};
 const safeCSVValue=x=>{let s=typeof x==='object'&&x!==null?JSON.stringify(x):String(x??'');if(/^[=+@\-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const csv=(headers,rows)=>'\uFEFF'+[headers,...rows].map(r=>r.map(safeCSVValue).join(',')).join('\r\n');
 const processCounts=(partners,annotations,rules)=>{const counts={};for(const p of partners){const a=annotations[p];if(!a)continue;const text=(a.name||'')+' '+(a.function||'');for(const [name,pattern]of rules)if(new RegExp(pattern,'i').test(text))counts[name]=(counts[name]||0)+1;}return Object.entries(counts).sort((a,b)=>b[1]-a[1]);};
 root.AtlasModel={norm,numeric,esc,route,filterGenes,sortGenes,paginate,csv,locationNames,processCounts};
})(typeof window!=='undefined'?window:globalThis);
