(function(){
 'use strict';const X=window.ATLAS_REVIEW_INDEX,M=window.AtlasModel,A=window.AtlasReview,E=M.esc,$=s=>document.querySelector(s);let page=1,filtered=X.rows;
 $('#review-overview').innerHTML=A.reviewBanner()+`<div class="review-summary"><span>候选 ${X.rows.length}</span><span>有IF图 ${X.summary.IF_genes}</span><span>官方IF样本图 ${X.summary.IF_images}</span><span>精确序列AF模型 ${X.summary.AF_exact_sequence_genes}</span><span>当前历史L1：全池46 / new池21</span></div>`;
 $('#review-method').innerHTML=X.reportHtml;
 function render(){
  const q=$('#review-search').value.toLowerCase().trim(),s=$('#review-status').value,c=$('#review-category').value,a=$('#review-available').value;
  filtered=X.rows.filter(r=>(!s||r.status===s)&&(!c||r.HPA_descriptive_category===c)&&(!a||a==='if'&&r.IF_images>0||a==='af'&&r.AF_exact_sequence_models>0||a==='hold'&&r.AF_models>0&&!r.AF_exact_sequence_models)&&(!q||[r.symbol,r.hgnc,r.HPA_main,r.HPA_additional].join(' ').toLowerCase().includes(q)));
  const p=M.paginate(filtered,page,50);page=p.page;$('#review-count').textContent=filtered.length+' / 716 名候选；描述来自官方注释，尚未人工阅图。';
  $('#review-rows').innerHTML=p.rows.map(r=>`<tr><td><button class="gene-button" data-review-gene="${E(r.symbol)}">${E(r.symbol)}</button><br>${E(r.hgnc)} · ${E(r.status)}</td><td>${E(r.original_tiers||'未联接原行')} / ${E(r.historical_L)}</td><td class="loc-cell">${E(r.HPA_main||'未提供')}</td><td class="loc-cell">${E(r.HPA_additional||'未提供')}</td><td>${E(r.HPA_current_reliability||'未提供')}</td><td>IF ${r.IF_images}张<br>AF ${r.AF_models}个${r.AF_models&&!r.AF_exact_sequence_models?'<br><strong>序列版本差异</strong>':''}<br><button class="small-button" data-review-gene="${E(r.symbol)}">结构与IF →</button></td><td>待人工审查</td></tr>`).join('');
  $('#review-pages').innerHTML=`<button data-review-page="${page-1}" ${page===1?'disabled':''}>上一页</button><span>${page} / ${p.pages}</span><button data-review-page="${page+1}" ${page===p.pages?'disabled':''}>下一页</button>`;
 }
 async function openGene(g){$('#review-list').hidden=true;$('#review-detail').hidden=false;$('#review-gene-title').textContent=g;$('#review-detail-body').textContent='正在读取原始证据…';history.replaceState(null,'','#gene='+encodeURIComponent(g));try{$('#review-detail-body').innerHTML=await A.detail(g);}catch(e){$('#review-detail-body').textContent=e.message;}$('#review-gene-title').scrollIntoView();}
 document.addEventListener('click',e=>{const b=e.target.closest('[data-review-gene],[data-review-page]');if(!b)return;if(b.dataset.reviewGene)openGene(b.dataset.reviewGene);else{page=Number(b.dataset.reviewPage);render();}});
 $('#review-back').addEventListener('click',()=>{$('#review-detail').hidden=true;$('#review-list').hidden=false;history.replaceState(null,'',location.pathname);});
 $('#review-search').addEventListener('input',()=>{page=1;render();});for(const s of ['#review-status','#review-category','#review-available'])$(s).addEventListener('change',()=>{page=1;render();});
 $('#review-export').addEventListener('click',()=>{const keys=Object.keys(filtered[0]||X.rows[0]),content=M.csv(keys,filtered.map(r=>keys.map(k=>r[k]))),u=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download='localization_review_20261021.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
 render();const gene=new URLSearchParams(location.hash.slice(1)).get('gene');if(gene&&X.files[gene])openGene(gene);
})();
