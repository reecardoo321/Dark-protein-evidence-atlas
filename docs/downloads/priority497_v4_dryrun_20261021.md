# new497 v4 评分 dry-run（本地只读复算）

- 范围：497 个 new497；原716与219不受影响；不写入远端 manifest，不替换 v3。
- 输入 SHA256：`c8c8528985f253e884442662df2c2802924212220f800630812065654e5f4a89`；背景专门参照加权占比 p0 = 0.0872。
- 权重仍为 25/35/20/15/5；A 队列按 v3 口径保留 82 个，其中 A1=19、A2=63。
- 这是本地 dry-run，不是远端 guard 运行、不是正式交付；所有参数待你确认后再在 Pod 上版本化重算。

## 1. 关键行为变化

| 检查 | v3 | v4 dry-run |
|---|---:|---:|
| 染色质分与 PPI 数 Spearman | 0.564 | 0.038 |
| 染色质分与纯度 Spearman | 0.891 | 0.86 |
| A 前20重叠 | — | 15/20 |
| 评估覆盖≥60% | — | 417 人 |
| 评估覆盖<60% | — | 80 人（不参加主排序） |

### v3 前20

LRRC42、CRYBG2、PNMA8A、PHLDB3、EFCAB5、ZDBF2、NOAZFP、KIAA0408、TIGD2、MSANTD3、THAP8、CIMIP6、MAB21L3、PRR3、FLYWCH2、ZSWIM9、EFCAB12、R3HDM2、JRKL、TCEANC2

### v4 前20（A 内）

CRYBG2、LRRC42、EFCAB5、TIGD2、ZDBF2、MSANTD3、EFCAB12、MAB21L3、ZSWIM9、THAP8、TMEM35B、PNMA8A、KIAA0408、CIMIP6、RIPOR3、NOAZFP、PHLDB3、SH3BGRL2、TSTD2、PRELID2

## 2. A1 名单（19）

A1 = v3 A 队列内、无已知/近缘机制、纯度≥0.15、≥2 个专门染色质伙伴。排序为 v4 分。

| # | 蛋白 | v4分 | 定位 | 纯度 | 染色质分 | 专门伙伴 |
|---:|---|---:|---:|---:|---:|---|
| 1 | CRYBG2 | 79.1 | 1.00 | 0.34 | 0.70 | PARP1, PARP2, EZH2, MGA, KAT14, L3MBTL2, MBIP, PCGF6… |
| 2 | LRRC42 | 76.6 | 1.00 | 0.35 | 0.56 | PARP2, EYA4, KAT5, RAG2, USP7 |
| 3 | EFCAB5 | 68.5 | 0.72 | 0.43 | 0.61 | PARP1, PARP3, H1-5, USP7, WDR5, SETD3 |
| 4 | TIGD2 | 67.1 | 0.85 | 0.38 | 0.50 | PARP3, EP300, H4C1, SMARCA4, SMARCB1 |
| 5 | ZDBF2 | 67.0 | 0.85 | 0.21 | 0.45 | CTBP1, H1-5, HDAC1, MSH6, SET, TAF12, SIRT6, RCOR1… |
| 6 | MSANTD3 | 66.4 | 0.85 | 0.24 | 0.42 | BUB1, H3-3A, H4C1, SUV39H1, TP53BP1 |
| 7 | EFCAB12 | 66.1 | 0.85 | 0.57 | 0.49 | H1-2, H1-4, H1-5 |
| 8 | MAB21L3 | 65.6 | 1.00 | 0.16 | 0.32 | PHC2, SIRT1, CHD8, CHD7, CHD9, INO80E |
| 9 | THAP8 | 64.6 | 1.00 | 0.18 | 0.28 | SETDB1, PRMT7 |
| 10 | TMEM35B | 64.3 | 1.00 | 0.22 | 0.29 | H1-5, H2AC20, SETD3 |
| 11 | CIMIP6 | 63.3 | 0.70 | 0.31 | 0.52 | BABAM2, BRCC3, BABAM1, ABRAXAS2 |
| 12 | RIPOR3 | 63.0 | 1.00 | 0.30 | 0.38 | PARP1, SCML4 |
| 13 | NOAZFP | 62.6 | 0.57 | 0.24 | 0.54 | PARP1, BAZ1A, BAZ1B, BRD1, BRD2, BRD3, CBX2, CBX3… |
| 14 | PHLDB3 | 61.8 | 0.59 | 0.19 | 0.42 | BMAL1, CLOCK, HMG20A, MAX, TFPT, SIRT1, RCOR1, OIP5… |
| 15 | JRKL | 60.4 | 0.85 | 0.20 | 0.30 | EP300, H4C1, SMARCA4, SMARCB1, WDR5 |
| 16 | TIGD6 | 60.4 | 0.75 | 0.24 | 0.40 | CHAF1A, MTA1, HDGFL2, SS18L2 |
| 17 | FAM219B | 59.0 | 0.85 | 0.21 | 0.30 | ELP2, ELP3 |
| 18 | KIAA1549L | 56.8 | 0.85 | 0.38 | 0.34 | PARP3, USP7 |
| 19 | R3HDM4 | 56.7 | 0.85 | 0.44 | 0.31 | H2BC9, NPM1 |

## 3. 代表蛋白新旧对照

| 蛋白 | v3总分 | v4总分 | 定位 v3→v4 | 染色质 v3→v4 | 纯度 | 说明 |
|---|---:|---:|---|---:|---:|---|
| CRYBG2 | 76.9 | 79.1 | 0.80→1.00 | 0.87→0.70 | 0.34 | Approved 不再扣定位；纯度0.34 |
| LRRC42 | 78.1 | 76.6 | 1.00→1.00 | 0.71→0.56 | 0.35 | 稳定 |
| EFCAB5 | 71.0 | 68.5 | 0.80→0.72 | 0.71→0.61 | 0.43 | 核体+线粒体附加计入 |
| PNMA8A | 74.2 | 63.8 | 0.95→0.85 | 0.59→0.26 | 0.12 | 109伙伴、纯度0.12 |
| PHLDB3 | 72.5 | 61.8 | 0.80→0.59 | 0.69→0.42 | 0.19 | 核斑+胞质+膜 |
| NOAZFP | 70.0 | 62.6 | 0.95→0.57 | 0.71→0.54 | 0.24 | 5个胞外附加、411伙伴 |
| PRR3 | 65.7 | 57.3 | 0.80→0.85 | 0.47→0.09 | 0.04 | 212伙伴、纯度0.04 |
| R3HDM2 | 63.4 | 58.9 | 0.95→1.00 | 0.32→0.05 | 0.02 | 97伙伴、纯度0.02 |
| EFCAB12 | 63.5 | 66.1 | 0.80→0.85 | 0.55→0.49 | 0.57 | 5伙伴、纯度0.57 |

## 4. v4 分量定义（dry-run 实际实现）

- **定位 25**：主定位区室权重（nucleoplasm/chromatin 1.00；nuclear body/speckle 0.85；nucleolus 0.75；nucleus 0.90；envelope 0.45；胞质 0.10）× 附加定位排他因子（无胞外附加1.00；1个0.85；≥2个0.70；混合主定位0.55；核仅附加0.30）× 来源一致性（HPA+独立UniProt/GO 1.05；HPA单独1.00；冲突0.90；仅UniProt 0.65；仅GO 0.55；Uncertain+独立支持0.85，否则未评估）。Enhanced/Supported/Approved 不再改变点位，只改变区间宽度；Uncertain/多基因才降权。
- **染色质 35**：A=Σ枢纽权重×参照权重（专门1、广泛0.25），T=Σ枢纽权重；p_adj=(A+0.5)/(T+2.5)；purity=min(1,p_adj/0.5)；z=(A−p0T)/sqrt(p0(1−p0)T)；enrich=clip(z/4)；support=1−exp(−A/1.2)；diversity=min(1,研究程序数/3)；chrom=purity×(0.25+0.75support)×(0.85+0.15diversity)+0.10enrich。
- **可靠性 20**：0.5×前3边平均质量 + 0.2×研究程序数/3 + 0.2×有效伙伴数/3 + 0.1×是否有明确背景；共享序列封顶0.5；有效伙伴数=(Σw)²/Σw²。
- **机会 15**：机制空白10 + 研究基础5。novelty=own 0.05 / family 0.20 / 否则0.20+0.45×clip((0.6−r)/0.4) / 无近缘0.65；study=clip(log1p(PubMed)/log(60))；opportunity=(2×novelty+study)/3。
- **可操作性 5**：min(1,L/100,1000/L)。
- **聚合**：raw=100×Σ已评估权重×分量/Σ已评估权重；coverage=Σ已评估权重/100；score=50+(raw−50)×coverage；coverage<0.6 不进主排序。


## 5. 仍需你确认

1. A1 门槛是否用“纯度≥0.15 且≥2个专门伙伴”（19人），还是更严的纯度≥0.20（约14人）或更宽的≥1个专门伙伴。
2. reliability 是否完全不影响定位点位（本 dry-run 采用），还是保留 0.92/0.97 轻微折扣。
3. PubMed 研究基础占 5 分是否合适；是否改为独立可开关层。
4. 是否把 coverage<0.6 的候选完全移出主排序（本 dry-run 仅标记，未删）。
5. 确认后我再在 Pod 上以新 run ID、guard、UID1551、独立 QA 重算，并生成网站 v4 数据；不覆盖 v3。

## 6. 边界

EpiFactors 已用于染色质打分，不能再当独立验证；PubMed 是研究关注度/试剂基础代理，不是机制证据；A1/A2 是审查分层，不是已验证新机制；本 dry-run 未做人工逐图定位或逐篇文献审查。
