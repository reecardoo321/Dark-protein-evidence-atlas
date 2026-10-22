# new497 v4.1 修复与完整评分方法

范围不变：716主池 = 497人工子集 + 219未纳入；本版仅重排497。没有新增候选或删除节点。

## 五项单总分

默认权重25/35/20/15/5。B=Σw×分量，C=(已评L/E/R权重+wO+wT)/Σw，S=B×(0.6+0.4C)。L/E/R缺失保留null，仅计算暂计0；O null回退0.5。并非阳性率或校准概率。

## 定位

nuclear-only main: existing branch; nuclear AND extranuclear main: .55; extranuclear main with nuclear additional: .30; HPA without nuclear support: .10; independent support/cross-reactivity adjustments unchanged
证据没有核支持不等于证明非核。独立UniProt/GO核证据加0.05，交叉反应及证据缺失规则保留。主定位全为核时沿用原v4各区室参数。来源可靠性宽度：enhanced .02/supported .04/approved .06/uncertain .20/unreported .10；交叉反应再加.10。区间仅是敏感性，不是统计置信区间。

## 染色质与关联可靠性

A=专门染色质core且specificity_weight=1的hub_weight之和；T=全部观测边hub_weight之和；p0=全497的ΣA/ΣT。p_adj=(A+.5)/(T+2.5)，purity=min(1,p_adj/.5)是归一化收缩指标而非原始比例；enrichment=clip((A-p0T)/sqrt(p0(1-p0)T+1e-9)/4)；support=1-exp(-A/1.2)，diversity=min(1,core_programmes类别数/3)。E=clip(purity×(.25+.75support)×(.85+.15diversity)+.10enrichment)。广泛参照.25不进入A；没有专门命中不是生物功能阴性。
可靠性R=.5×top3质量均值+.2×min(1,programme数/3)+.2×min(1,有效支持数/3)+.1×明确背景；core优先，否则全部边；有效支持数=(Σhub)^2/Σhub²。共享序列组上限.5。programme是研究系列代理，不是独立实验重复数。

## 机制空间与研究基础、大小

N：成员机制已知.05；家族机制已评.20；否则有FUNCTION PMID参考时N=.20+.45×clip((.6-最高序列identity)/.4)；没有该参考.65。这是代理，不证明未知。study=clip(log1p(Gene关联PMID数)/log60)，O=(2N+study)/3；默认约10N+5study，论文数多会正向加分至饱和，保留v4规则。
T=min(1,length/100,1000/length)，100–1000 aa满分；极端大小软降分，不删除。

## 代表、导出和敏感性

fixed v3 direct-star group membership/anchor; highest current v4.1 score inside group; tie prefers old anchor then symbol; no member removed; no all-pairs equivalence claim
默认TSV导出嵌套诊断、定位分支/敏感性、原anchor和当前代表。网页动态权重按当前wO+wT计算C并重新挑选同组展示代表。每项基础贡献乘相同覆盖因子才可加到最终总分。未知项满分上界与定位敏感性区间分别展示。

## 本次影响

94个分数改变；370个排名改变；11组代表改变。497节点、435固定组以及非定位分量不变。

完整变化见repair_comparison.json；全部分量见ranked_candidates497_v4.tsv。原输入、旧v3/v4及原图谱不修改。未开展新科学性能验证，model_complete=false。
