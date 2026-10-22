/* Focused one-by-one review UI. Renders into #view-content when state.view==='review'. */
(function(){
 'use strict';
 const RS=window.AtlasReviewState,PUI=window.AtlasPriorityUI,M=window.AtlasModel;
 if(!RS||!PUI||!M)return;
 const E=M.esc;
 const reviewRows=new Map(((window.ATLAS_REVIEW_INDEX&&window.ATLAS_REVIEW_INDEX.rows)||[]).map(r=>[r.symbol,r]));
 let opts={onOpenGene:function(){},onToast:function(){},onChange:function(){}};
 let filter='unreviewed',scope='subset',index=0,autoNext=true,sort='priority';
 const FILTERS=[['unreviewed','未逐项确认'],['acceptReviewed','已确认接受'],['reject','已拒绝（全716）'],['pending','待定'],['all497','全部497'],['not_in_subset','219未纳入'],['all716','全部716']];
 function cmpPriority(a,b){
  const ra=PUI.get(a.symbol),rb=PUI.get(b.symbol);
  if(!ra&&!rb)return a.originalOrder-b.originalOrder;
  if(!ra)return 1;if(!rb)return -1;
  return PUI.exportRecord(a).rank-PUI.exportRecord(b).rank;
 }
 function rows(){
  let list=RS.list(scope,filter);
  list=list.slice().sort(sort==='priority'?cmpPriority:function(a,b){return a.originalOrder-b.originalOrder});
  return list;
 }
 function current(){
  const list=rows();
  if(!list.length)return null;
  if(index>=list.length)index=list.length-1;
  if(index<0)index=0;
  return list[index];
 }
 function cSub(){return RS.counts('subset')}
 function cAll(){return RS.counts('all')}
 function pct(n,d){return d?Math.round(100*n/d):0;}
 function statusPill(d,membership){
  let label=RS.label(d.status);
  if(d.status==='accept'&&!d.reviewed)label='默认接受 · 未确认';
  else if(RS.isBatchReject(d))label+=' · 名单批量排除';
  else if(d.reviewed)label+=' · 已确认';
  return '<span class="review-pill '+E(d.status)+'">'+E(label)+'</span>';
 }
 function membershipBadge(g){
  return g.status==='new'
   ?'<span class="pill new" title="在原497评分范围中">原497评分范围</span>'
   :'<span class="pill rejected" title="历史上不在497评分范围，当前决定另列">历史219未纳入</span>';
 }
 function progressHTML(){
  const s=cSub(),a=cAll();
  return '<div class="review-progress-box">'+
   '<div class="review-progress-line"><strong>'+s.reviewed+'</strong> / '+s.total+' 已逐项确认'+
   '<span class="muted">接受 '+s.acceptReviewed+' · 拒绝 '+s.reject+' · 待定 '+s.pending+'</span></div>'+
   '<div class="progress-track" aria-hidden="true"><span style="width:'+pct(s.reviewed,s.total)+'%"></span></div>'+
   '<div class="ref-label">原497中名单批量排除 '+s.batchRejected+' 名；全池批量排除 '+a.batchRejected+' 名，均不计逐项确证。全部716中人工确认 '+a.reviewed+' / '+a.total+'。</div></div>';
 }
 function tabsHTML(){
  const s=cSub(),a=cAll();
  const count={unreviewed:s.unreviewed,acceptReviewed:s.acceptReviewed,reject:a.reject,pending:s.pending,all497:s.total,not_in_subset:a.not_in_subset,all716:a.total};
  return '<div class="review-tabs" role="group" aria-label="审查筛选">'+FILTERS.map(function(pair){
   const key=pair[0],name=pair[1];
   const active=key==='reject'?(scope==='all'&&filter==='reject'):(key==='all716')?(scope==='all'&&filter==='all'):(key==='all497'?(scope==='subset'&&filter==='all'):(key==='not_in_subset'?(scope==='outside'&&filter==='not_in_subset'):(scope==='subset'&&filter===key)));
   return '<button class="review-tab '+(active?'active':'')+'" data-review-action="tab" data-review-value="'+E(key)+'">'+E(name)+' <b>'+count[key]+'</b></button>';
  }).join('')+'</div>';
 }
 function card(g){
  const r=PUI.get(g.symbol),loc=reviewRows.get(g.symbol)||{},d=RS.get(g.symbol);
  const score=r?PUI.score(g.symbol):null;
  const partners=(r&&r.chromatin_partners)||[];
  const flags=(r&&r.flags)||[];
  const note=d.note||'';
  const active=function(s){return d.status===s?'active':''};
  return '<article class="review-main-card" data-current-symbol="'+E(g.symbol)+'">'+
   '<div class="review-card-head">'+
    '<div><div class="review-kicker">'+(index+1)+' / '+rows().length+' · '+E(scope==='outside'?'219未纳入':scope==='all'?'全部716':'497子集')+'</div>'+
    '<h2 class="review-symbol">'+E(g.symbol)+'</h2>'+
    '<div class="review-meta">'+membershipBadge(g)+(d.status==='not_in_subset'?'':statusPill(d))+'<span class="pill info">'+E(g.shared>1?'共享序列':'单一身份')+'</span></div>'+
    '<p class="review-name">'+E(g.name||'未提供蛋白名')+' · '+E(g.family||'未分组')+' · '+E(g.hgnc)+'</p></div>'+
    '<div class="review-score-box"><strong>'+(g.status==='new'?(score==null?'—':Number(score).toFixed(2)):'—')+'</strong><span>'+(g.status==='new'?'优先度总分 · 非概率':'不在497重排范围')+'</span><small>'+(g.status==='new'?'按总分排序；无A/B/C/D分层':'219未纳入 · 仍可人工接受/拒绝')+'</small></div>'+
   '</div>'+
   '<div class="review-grid">'+
    '<section class="review-section"><h4>定位与图像</h4><p>HPA 主定位：<b>'+E(loc.HPA_main||'未提供')+'</b><br>附加：'+E(loc.HPA_additional||'未提供')+'<br>基因级可靠性：'+E(loc.HPA_current_reliability||'未提供')+' · IF '+Number(loc.IF_images||0)+' 张</p><p class="ref-label">历史 '+E(g.loc)+' 与旧 tier 只作来源对照，不是核定位概率。</p></section>'+
    '<section class="review-section"><h4>染色质/表观遗传伙伴</h4><p>'+(g.status==='new'?(partners.length?partners.slice(0,10).map(E).join('、')+(partners.length>10?' 等 '+partners.length+' 个':''):'当前未命中本版染色质参照；不是功能阴性。'):'该蛋白不在new497重排范围，本卡不展示重排伙伴层；完整证据请打开档案。')+'</p><p class="ref-label">PPI 伙伴共 '+Number(g.ppi||0)+' 个；分子参考 '+Number(g.molecular||0)+' 个；Gene 关联 PMID '+Number(g.pubmed||0)+'。</p></section>'+
    '<section class="review-section"><h4>需要先核对的限制</h4>'+(flags.length?'<ul class="review-flags">'+flags.slice(0,4).map(function(f){return '<li>'+E(f)+'</li>'}).join('')+'</ul>':'<p class="muted">本版没有额外自动提示；仍需核对原文和实验背景。</p>')+'</section>'+
    '<section class="review-section"><h4>你的判断</h4><p class="ref-label">表内保留原判断，表外按名单批量reject；你可继续人工修改，写入本浏览器。拒绝不是生物学阴性。</p><div class="review-actions">'+
     '<button class="button review-accept '+active('accept')+'" data-review-action="accept" data-gene="'+E(g.symbol)+'">✓ 接受 <kbd>A</kbd></button>'+
     '<button class="button review-reject '+active('reject')+'" data-review-action="reject" data-gene="'+E(g.symbol)+'">✗ 拒绝 <kbd>R</kbd></button>'+
     '<button class="button '+active('pending')+'" data-review-action="pending" data-gene="'+E(g.symbol)+'">待定 <kbd>S</kbd></button>'+
     '<button class="text-button" data-review-action="reset" data-gene="'+E(g.symbol)+'">重置默认</button></div>'+
     '<textarea class="note-area review-note-current" id="review-note-current" data-current-note="'+E(g.symbol)+'" placeholder="记录接受/拒绝理由、要核对的原文、实验条件或疑问…">'+E(note)+'</textarea>'+
     '<p class="note-saved">'+(d.updatedAt?'最近保存：'+E(d.updatedAt):'笔记自动保存在本浏览器；可在顶部导出。')+'</p></section>'+
   '</div>'+
   '<div class="review-card-actions"><button class="button" data-review-action="prev">← 上一个</button><button class="button primary" data-review-action="next">下一个 →</button><button class="text-button" data-review-action="skip">跳过</button><button class="text-button" data-review-action="open">打开完整档案与证据 →</button></div>'+
  '</article>';
 }
 function emptyHTML(){
  const s=cSub();
  return '<div class="review-empty"><h3>这个队列已经处理完</h3><p>497 中已逐项确认 '+s.reviewed+' / '+s.total+'；接受 '+s.acceptReviewed+'，拒绝 '+s.reject+'，待定 '+s.pending+'。</p><div class="review-actions"><button class="button" data-review-action="tab" data-review-value="all497">查看全部497</button><button class="button" data-review-action="tab" data-review-value="reject">查看已拒绝</button><button class="button primary" data-review-export="1">↓ 导出JSON</button><button class="button" data-review-export-csv="1">↓ CSV</button></div><p class="ref-label">导出的 JSON/CSV 可发回项目方，作为下一版名单的输入；网页本身不写服务器。</p></div>';
 }
 function toolbarHTML(){
  return '<div class="review-toolbar"><div>'+tabsHTML()+'</div><div class="review-toolbar-right">'+
   '<span class="review-sort-label">排序</span>'+
   '<button class="review-tab '+(sort==='priority'?'active':'')+'" data-review-action="sort" data-review-value="priority">优先度总分</button>'+
   '<button class="review-tab '+(sort==='original'?'active':'')+'" data-review-action="sort" data-review-value="original">原716顺序</button>'+
   '<label class="review-auto"><input type="checkbox" id="review-auto" '+(autoNext?'checked':'')+'> 决定后自动下一个</label>'+
   '<button class="button" data-review-export="1">↓ 导出JSON</button><button class="button" data-review-export-csv="1">↓ CSV</button><button class="button" data-review-import="1">↑ 导入</button>'+
   '<button class="text-button" data-review-action="resetAll">全部重置</button></div></div>';
 }
 function render(){
  const list=rows(),g=current();
  if(index>=list.length&&list.length)index=list.length-1;
  const body=g?card(g):emptyHTML();
  return '<div class="review-view">'+
   '<div class="review-head"><div><p class="eyebrow">ONE-BY-ONE REVIEW</p><h2>逐个审查 · 716主池 / 原497评分范围</h2><p class="review-sub">本次主表416名保留已有判断；表外300名已按用户指令reject。默认继续审查原497中的未决成员；批量排除与逐项人工确证分别统计。</p></div>'+progressHTML()+'</div>'+
   toolbarHTML()+body+
   '<p class="review-foot">审查结果只保存在当前浏览器（localStorage），不会写回 GitHub 或远端项目。请定期导出 JSON 备份；换浏览器/清理缓存会丢失本地状态。</p>'+
  '</div>';
 }
 function afterDecision(){
  const list=rows();
  if(autoNext){
   if(filter==='unreviewed'){/* current left the queue; same index is next */}
   else index++;
  }
  if(index>=list.length)index=Math.max(0,list.length-1);
  opts.onChange();
 }
 function action(name,value){
  const g=current();
  if(name==='accept'||name==='reject'||name==='pending'){
   if(!g)return;
   RS.set(g.symbol,name);
   opts.onToast(name==='accept'?'已接受 '+g.symbol:name==='reject'?'已拒绝 '+g.symbol:'已标为待审 '+g.symbol);
   afterDecision();return;
  }
  if(name==='next'){index++;if(index>=rows().length)index=Math.max(0,rows().length-1);opts.onChange();return;}
  if(name==='prev'){index=Math.max(0,index-1);opts.onChange();return;}
  if(name==='skip'){index++;if(index>=rows().length)index=Math.max(0,rows().length-1);opts.onChange();return;}
  if(name==='open'){if(g)opts.onOpenGene(g.symbol,'overview');return;}
  if(name==='reset'){if(g){RS.reset(g.symbol);opts.onToast('已重置 '+g.symbol+'；笔记保留');opts.onChange();}return;}
  if(name==='resetAll'){
   if(confirm('把716个蛋白恢复本次名单默认？表外300名恢复reject，表内恢复原默认；笔记保留。')){RS.resetAll({keepNotes:true});index=0;opts.onChange();opts.onToast('已全部重置');}
   return;
  }
  if(name==='tab'){
   if(value==='all716'){scope='all';filter='all';}
   else if(value==='all497'){scope='subset';filter='all';}
   else if(value==='reject'){scope='all';filter='reject';}
   else if(value==='not_in_subset'){scope='outside';filter='not_in_subset';}
   else{scope='subset';filter=value;}
   index=0;opts.onChange();return;
  }
  if(name==='scope'){scope=value==='all'?'all':'subset';filter='all';index=0;opts.onChange();return;}
  if(name==='sort'){sort=value==='original'?'original':'priority';index=0;opts.onChange();return;}
  if(name==='auto'){autoNext=value==='on'?true:value==='off'?false:!autoNext;opts.onChange();return;}
 }
 function key(e){
  if(e.target&&/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return false;
  if(document.querySelector('#detail-dialog[open]'))return false;
  const k=e.key;
  if(k==='a'||k==='A'){action('accept');return true;}
  if(k==='r'||k==='R'){action('reject');return true;}
  if(k==='s'||k==='S'){action('pending');return true;}
  if(k==='ArrowLeft'){action('prev');return true;}
  if(k==='ArrowRight'){action('next');return true;}
  return false;
 }
 function init(o){opts=Object.assign(opts,o||{});return api;}
 const api={init:init,render:render,action:action,key:key,current:function(){const g=current();return g?g.symbol:null},get filter(){return filter},get scope(){return scope},get autoNext(){return autoNext}};
 window.AtlasReviewUI=api;
})();
