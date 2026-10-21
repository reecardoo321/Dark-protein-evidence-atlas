(function(){
 'use strict';
 const X=window.ATLAS_REVIEW_INDEX,E=window.AtlasModel.esc;
 const labels={nuclear_main_only:'核相关主定位；未见其他主定位',mixed_main:'核与非核混合主定位',nuclear_additional:'核仅为附加定位',non_nuclear_IF:'当前IF未标注核定位',no_IF_annotation:'当前无IF定位注释'};
 const link=(u,t)=>/^https:\/\//.test(u||'')?`<a href="${E(u)}" target="_blank" rel="noopener noreferrer">${E(t||u)}</a>`:'';
 const text=x=>E(x===null||x===undefined||x===''?'未提供':x);
 const memo=new Map();
 async function get(symbol){
  const f=X?.files[symbol];if(!f)throw new Error('该基因没有复审记录');
  if(!memo.has(f.key))memo.set(f.key,new Promise((resolve,reject)=>{
   const s=document.createElement('script');s.src=f.url;s.onload=()=>resolve(window.ATLAS_REVIEW_BUNDLES[f.key]);s.onerror=()=>reject(new Error('复审记录载入失败'));document.head.append(s);
  }));
  return (await memo.get(f.key))[symbol];
 }
 function reviewBanner(){
  return `<div class="scope-note warn"><strong>定位正在复审，旧优先分尚未修订。</strong>原表tier、历史L1–L3与“是否主要位于核内”不是同一概念。新图像来自HPA官方原始记录，尚未逐图人工判定。<a href="review.html">打开716蛋白定位复审总表 →</a></div>`;
 }
 async function detail(symbol){
  const r=await get(symbol),h=r.hpa,models=r.structures,images=h.images;
  const sources=r.originalMasterRows;
  const locs=h.summaryRecords.map(x=>`<p><strong>${text(x.ensembl)} · HPA v${text(x.version)}</strong><br>${text(x.summary)}<br>IF可靠性：${text(x.reliability)} · ${link(x.url,'HPA原始定位页')}</p>`).join('');
  const history=`<section class="card"><h3>定位复审：三个维度分别读取 <span class="pill warn">尚未人工阅图</span></h3><dl class="annotation-fields"><dt>当前HPA主定位</dt><dd>${text(h.mainLocations.join('；'))}</dd><dt>当前HPA附加定位</dt><dd>${text(h.additionalLocations.join('；'))}</dd><dt>来源描述分类</dt><dd>${text(labels[h.descriptiveCategory])}</dd><dt>历史来源层</dt><dd>${text(r.historicalTier)}（来源支持规则，不是核定位概率）</dd><dt>最初总表tier</dt><dd>${text([...new Set(sources.map(s=>s.tier))].join(' / '))}${sources.length?'（原值保留，不能按相同数字映射到L层）':'（未精确联接原表行）'}</dd></dl>${locs||'<p>当前HPA未提供IF定位注释；不能解释为非核蛋白。</p>'}<details><summary>原总表定位断言与行号</summary><pre class="data-blob">${E(JSON.stringify(sources,null,2))}</pre></details><details><summary>当前UniProt成员级定位及证据码</summary><pre class="data-blob">${E(JSON.stringify(r.uniprot,null,2))}</pre></details><p class="ref-label">核膜/核孔与核质/染色质不同，主/附加和混合定位均需结合细胞背景判读。HPA与UniProt可能共享已有证据，不能当独立重复。</p></section>`;
  const structure=`<section class="card"><h3>AlphaFold三维结构 <span class="pill info">已存在的预测模型</span></h3><p>只查看已有AF模型；不在网页运行结构预测。pLDDT表示局部结构置信度，不代表核定位或功能置信度。</p>${models.length?`<div class="structure-controls"><label>模型<select id="review-structure-model" aria-label="选择AlphaFold模型">${models.map((m,i)=>`<option value="${i}">${text(m.entryId)} · ${text(m.start)}–${text(m.end)} · ${m.sequenceMatchesFrozen?'与冻结序列一致':'与冻结序列不同，当前版本'}</option>`).join('')}</select></label><button class="button primary" data-review-load="${E(symbol)}">载入三维结构</button><button class="small-button" data-review-reset>重置视角</button></div><div class="structure-viewer" id="review-structure-viewer" role="img" aria-label="${E(symbol)}的AlphaFold三维结构"><p>点击“载入三维结构”；坐标从AlphaFold官方来源按需读取。</p></div><p id="review-structure-status" class="graph-note" aria-live="polite"></p><div class="plddt-key"><span style="--c:#0053d6">≥90</span><span style="--c:#65cbf3">70–90</span><span style="--c:#ffdb13">50–70</span><span style="--c:#ff7d45">&lt;50</span></div>${models.map(m=>`<details class="model-metadata"><summary>${text(m.entryId)} · 平均pLDDT ${text(m.meanPLDDT)}${m.sequenceMatchesFrozen?'':' · 序列版本差异'}</summary><p>accession ${text(m.accession)}；v${text(m.version)}；模型区间 ${text(m.start)}–${text(m.end)}；全序列${text(m.length)}aa。${m.sequenceMatchesFrozen?'模型所附全长序列SHA256与冻结查询一致。':'当前AF序列与冻结查询不一致，仅供当前版本展示，不替代既有分析坐标。'}</p>${link(m.sourceUrl,'AlphaFold来源')} · ${link(m.pdbUrl,'PDB坐标')} · ${link(m.cifUrl,'mmCIF坐标')} · ${link(m.paeImageUrl,'PAE图')}</details>`).join('')}`:'<p>本轮未获取到可明确联接的AF模型，请通过UniProt原页核查；请求失败、无记录与无结构不同。</p>'}</section>`;
  const gallery=`<section class="card"><h3>HPA蛋白免疫荧光图 · ${images.length}张 <span class="pill warn">供人工判读</span></h3><p>绿色为目标蛋白，蓝色为细胞核，红色为微管。图片按抗体和细胞系排列，保留全部成功获取的样本，没有按“看起来更核内”筛选。抗体可能存在家族交叉反应，细胞系结果不代表所有组织。</p>${images.length?`<div class="if-gallery">${images.map((im,i)=>`<figure><a href="${E(im.imageUrl)}" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" src="${E(im.imageUrl)}" alt="${E(symbol+' '+im.antibody+' '+im.cellLine+' HPA免疫荧光图 '+(i+1))}"></a><figcaption><strong>${text(im.cellLine)} · ${text(im.antibody)}</strong><br>本图细胞系标注：${text(im.locations.join('；'))}<br>抗体验证：${text(im.validation)} · ${text(im.scale)}<br>${link(im.sourceUrl,'HPA v'+im.version+'原页')} · ${link(im.imageUrl,'原始图片')}<br>Image credit: Human Protein Atlas · CC BY 4.0</figcaption></figure>`).join('')}</div>`:'<div class="scope-note">未获得此蛋白可展示的人类细胞IF图。可能为没有实验图像、未测或请求问题；不记作核定位阴性。</div>'}<p class="ref-label">图像读取依赖HPA图片服务；图像加载失败时请点原始图片或来源页。引用：${link('https://doi.org/10.1126/science.aal3321','Thul et al., Science 2017')}；${link('https://www.proteinatlas.org/about/licence','HPA许可与引用要求')}。元数据获取：2026-10-21。自动收集不是人工阅图结论。</p>${r.errors.length?`<details><summary>本成员的查询或身份问题</summary><pre class="data-blob">${E(JSON.stringify(r.errors,null,2))}</pre></details>`:''}</section>`;
  return history+structure+gallery;
 }
 let lib,viewer,requestToken=0;
 function loadLib(){
  if(window.$3Dmol)return Promise.resolve();
  if(!lib)lib=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='vendor/3Dmol-min.js';s.onload=resolve;s.onerror=()=>reject(new Error('三维查看组件读取失败'));document.head.append(s);});
  return lib;
 }
 document.addEventListener('click',async e=>{
  const b=e.target.closest('[data-review-load],[data-review-reset]');if(!b)return;
  if(b.hasAttribute('data-review-reset')){if(viewer){viewer.zoomTo();viewer.render();}return;}
  const token=++requestToken,symbol=b.dataset.reviewLoad,holder=document.querySelector('#review-structure-viewer'),status=document.querySelector('#review-structure-status');
  b.disabled=true;status.textContent='正在读取官方坐标…';
  try{
   const r=await get(symbol),i=Number(document.querySelector('#review-structure-model').value),m=r.structures[i];
   if(m.taxId!==9606||!m.sameRequestedAccession||!/^https:\/\/alphafold\.ebi\.ac\.uk\/files\//.test(m.pdbUrl||''))throw new Error('模型身份或官方来源核对未通过');
   await loadLib();const response=await fetch(m.pdbUrl,{signal:AbortSignal.timeout(45000)});if(!response.ok)throw new Error('官方坐标暂时无法读取：HTTP '+response.status);
   const pdb=await response.text();if(!pdb.includes('ATOM'))throw new Error('响应没有可读取的原子坐标');if(token!==requestToken||!holder.isConnected)return;
   holder.innerHTML='';viewer=window.$3Dmol.createViewer(holder,{backgroundColor:'#ffffff'});viewer.addModel(pdb,'pdb');viewer.setStyle({},{cartoon:{colorfunc:a=>a.b>=90?'#0053d6':a.b>=70?'#65cbf3':a.b>=50?'#ffdb13':'#ff7d45'}});viewer.zoomTo();viewer.render();
   status.textContent=m.entryId+' · 已加载官方坐标 · 可拖动旋转/滚轮缩放。'+(m.sequenceMatchesFrozen?'与冻结查询序列一致。':'当前版本与冻结查询不同，不替换已有分析。');
  }catch(err){status.textContent='暂未显示三维结构：'+err.message+'。请使用上方AF/PDB来源入口。';}finally{b.disabled=false;}
 });
 window.AtlasReview={get,detail,reviewBanner,labels};
})();
