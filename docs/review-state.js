/* Manual accept/reject review state for the 716 pool and its 497 subset.
   Static-site only: persisted in this browser, with JSON/CSV export/import. */
(function(root){
 'use strict';
 const KEY='protein-atlas-manual-review-20261021-v1';
 const OLD_KEY='protein-atlas-review-20261020-v1';
 const SCHEMA='protein-atlas-manual-review-1';
 const SNAPSHOT='2026-10-21';
 const STATUS={accept:'已接受',reject:'已拒绝',pending:'待审',not_in_subset:'未纳入497'};
 const SHORT={accept:'接受',reject:'拒绝',pending:'待审',not_in_subset:'未纳入'};
 let genes=[],map=new Map(),state=null,subs=[];
 const now=()=>new Date().toISOString();
 const isSubset=g=>g.status==='new';
 const membership=g=>isSubset(g)?'subset':'outside';
 const label=s=>STATUS[s]||s;
 const short=s=>SHORT[s]||s;
 const clone=d=>({...d});
 const defaults=g=>isSubset(g)
   ? {status:'accept',reviewed:false,note:'',updatedAt:null}
   : {status:'not_in_subset',reviewed:false,note:'',updatedAt:null};
 function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{return false}}
 function notify(){for(const f of subs){try{f(state)}catch{}}}
 function init(list){
  genes=list||[];map=new Map(genes.map(g=>[g.symbol,g]));
  const stored=read(KEY);
  state=stored&&stored.schema===SCHEMA&&stored.decisions?stored:{schema:SCHEMA,snapshot:SNAPSHOT,updatedAt:now(),decisions:{}};
  const old=read(OLD_KEY);const oldNotes=old&&old.notes?old.notes:{};
  for(const g of genes){
   const d=state.decisions[g.symbol];
   if(!d){
    state.decisions[g.symbol]=defaults(g);
    if(oldNotes[g.symbol])state.decisions[g.symbol].note=String(oldNotes[g.symbol]);
   }else{
    const def=defaults(g);
    if(!STATUS[d.status])d.status=def.status;
    if(typeof d.reviewed!=='boolean')d.reviewed=!!d.updatedAt;
    d.note=String(d.note||'');
    if(!d.note&&oldNotes[g.symbol])d.note=String(oldNotes[g.symbol]);
    if(!d.updatedAt)d.updatedAt=null;
   }
  }
  persist();return api;
 }
 function get(symbol){const d=state&&state.decisions?state.decisions[symbol]:null;return d?clone(d):null}
 function set(symbol,status,opts){
  opts=opts||{};
  if(!STATUS[status])throw new Error('未知审查状态：'+status);
  const g=map.get(symbol);if(!g)throw new Error('未知基因：'+symbol);
  const d=state.decisions[symbol]||defaults(g);
  d.status=status;
  if(status==='pending'||status==='not_in_subset')d.reviewed=false;
  else d.reviewed=opts.reviewed!==undefined?!!opts.reviewed:true;
  if(opts.note!==undefined)d.note=String(opts.note);
  d.updatedAt=now();state.decisions[symbol]=d;state.updatedAt=d.updatedAt;
  persist();notify();return clone(d);
 }
 function setNote(symbol,note){
  const g=map.get(symbol);if(!g)return null;
  const d=state.decisions[symbol]||defaults(g);
  d.note=String(note||'');d.updatedAt=now();state.decisions[symbol]=d;state.updatedAt=d.updatedAt;
  persist();return clone(d);
 }
 function reset(symbol,opts){
  opts=opts||{};
  const g=map.get(symbol);if(!g)return null;
  const d=state.decisions[symbol]||defaults(g);
  const oldNote=d.note||'';
  const next=defaults(g);next.updatedAt=now();
  if(opts.keepNote!==false)next.note=oldNote;
  state.decisions[symbol]=next;state.updatedAt=next.updatedAt;
  persist();notify();return clone(next);
 }
 function resetAll(opts){
  opts=opts||{};
  for(const g of genes){
   const d=state.decisions[g.symbol]||defaults(g);
   const note=opts.keepNotes===false?'':(d.note||'');
   state.decisions[g.symbol]={...defaults(g),note,updatedAt:now()};
  }
  state.updatedAt=now();persist();notify();return counts('subset');
 }
 function scopeGenes(scope){
  if(scope==='all')return genes;
  if(scope==='outside')return genes.filter(g=>!isSubset(g));
  return genes.filter(isSubset);
 }
 function counts(scope){
  scope=scope||'subset';
  const list=scopeGenes(scope);
  const c={scope,total:list.length,reviewed:0,unreviewed:0,accept:0,reject:0,pending:0,not_in_subset:0,acceptReviewed:0};
  for(const g of list){
   const d=state.decisions[g.symbol];
   if(!d)continue;
   c[d.status]=(c[d.status]||0)+1;
   if(d.reviewed)c.reviewed++;else c.unreviewed++;
   if(d.status==='accept'&&d.reviewed)c.acceptReviewed++;
  }
  return c;
 }
 function list(scope,filter){
  scope=scope||'subset';filter=filter||'unreviewed';
  return scopeGenes(scope).filter(g=>{
   const d=state.decisions[g.symbol];if(!d)return filter==='all';
   switch(filter){
    case 'all':return true;
    case 'unreviewed':return !d.reviewed;
    case 'reviewed':return d.reviewed;
    case 'accept':return d.status==='accept';
    case 'acceptReviewed':return d.status==='accept'&&d.reviewed;
    case 'reject':return d.status==='reject';
    case 'pending':return d.status==='pending';
    case 'not_in_subset':return d.status==='not_in_subset';
    default:return true;
   }
  });
 }
 function exportJSON(){
  return {
   schema:SCHEMA,snapshot:SNAPSHOT,exportedAt:now(),
   counts:{subset:counts('subset'),all:counts('all'),outside:counts('outside')},
   decisions:Object.fromEntries(genes.map(g=>[g.symbol,state.decisions[g.symbol]]))
  };
 }
 function importJSON(text,mode){
  mode=mode==='merge'?'merge':'replace';
  let data;try{data=JSON.parse(text)}catch{throw new Error('不是有效 JSON')}
  if(!data||typeof data!=='object'||!data.decisions||typeof data.decisions!=='object')throw new Error('缺少 decisions 对象');
  const next=mode==='merge'?{...state.decisions}:{};
  for(const g of genes){
   const src=data.decisions[g.symbol];
   if(src&&STATUS[src.status]){
    next[g.symbol]={status:src.status,reviewed:!!src.reviewed,note:String(src.note||''),updatedAt:src.updatedAt||null};
   }else if(mode==='merge'&&state.decisions[g.symbol]){
    next[g.symbol]=state.decisions[g.symbol];
   }else{
    next[g.symbol]=defaults(g);
   }
  }
  state.decisions=next;state.updatedAt=now();persist();notify();return counts('subset');
 }
 function exportCSV(){
  const head=['symbol','hgnc','membership','decision','decision_label','reviewed','note','updatedAt'];
  const rows=genes.map(g=>{
   const d=state.decisions[g.symbol];
   return [g.symbol,g.hgnc,isSubset(g)?'497子集':'219未纳入',d.status,label(d.status),d.reviewed?'是':'否',d.note,d.updatedAt||''];
  });
  const esc=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  return '\uFEFF'+[head,...rows].map(r=>r.map(esc).join(',')).join('\r\n');
 }
 function subscribe(fn){subs.push(fn);return ()=>{subs=subs.filter(f=>f!==fn)}}
 if(typeof window!=='undefined'){
  window.addEventListener('storage',e=>{
   if(e.key!==KEY)return;
   const stored=read(KEY);
   if(stored&&stored.decisions){state=stored;notify();}
  });
 }
 const api={init,get,set,setNote,reset,resetAll,counts,list,exportJSON,importJSON,exportCSV,subscribe,label,short,membership,isSubset,STATUS,SHORT,KEY,snapshot:SNAPSHOT,get genes(){return genes}};
 root.AtlasReviewState=api;
})(typeof window!=='undefined'?window:globalThis);
