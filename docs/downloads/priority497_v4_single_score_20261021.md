# new497 v4 单一优先度总分：正式重算与验收

- 运行：`priority497_v4_single_score_20261021`（builder）、`priority497_v4_single_score_review_20261021_v2`（独立QA）、`publish_priority497_v4_single_score_20261021`（manifest）。均在项目 guard、UID1551 下完成，builder/QA/publish 的 exit_code 与 child_actual_exit_code 均为 0。
- 输入 SHA256：`c8c8528985f253e884442662df2c2802924212220f800630812065654e5f4a89`；v3 来源：`/home/hujiatong/protein_atlas/model_v1/outputs/priority497_localization_20261021_v3/ranked_candidates497.json`。
- **无 A/B/C/D 或 A1/A2**；只输出一个优先度总分。v3 分量与历史分保留，不再决定显示顺序。

## 1. 总分定义

`base = 25×核定位 + 35×染色质相近度 + 20×可靠性 + 15×功能未知度 + 5×结构大小`

`score = base × (0.6 + 0.4×覆盖度)`

- 定位/染色质/可靠性缺失按 0 计入；功能未知按中性 0.5 计入，不因“没查到机制”被扣到 0。
- 覆盖度 =（已评估的定位/染色质/可靠性权重 + 15 + 5）/100；另列缺失项满分上界。
- 总分是启发式优先度，不是概率、阳性率或已验证机制。

## 2. 前20

| # | 蛋白 | 总分 | 覆盖 | 核定位 | 染色质 | 可靠性 | 功能未知 | 结构大小 |
|---:|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | CRYBG2 | 79.1 | 1.00 | 1.00 | 0.70 | 0.83 | 0.66 | 0.60 |
| 2 | LRRC42 | 76.6 | 1.00 | 1.00 | 0.56 | 0.83 | 0.70 | 1.00 |
| 3 | C8orf74 | 76.3 | 1.00 | 1.00 | 0.63 | 0.74 | 0.62 | 1.00 |
| 4 | C9orf85 | 72.7 | 1.00 | 0.55 | 0.83 | 0.76 | 0.64 | 1.00 |
| 5 | EFCAB5 | 68.5 | 1.00 | 0.72 | 0.61 | 0.78 | 0.67 | 0.67 |
| 6 | TIGD2 | 67.1 | 1.00 | 0.85 | 0.50 | 0.73 | 0.58 | 1.00 |
| 7 | ZDBF2 | 67.0 | 1.00 | 0.85 | 0.45 | 0.83 | 0.75 | 0.42 |
| 8 | MSANTD3 | 66.4 | 1.00 | 0.85 | 0.42 | 0.76 | 0.68 | 1.00 |
| 9 | EFCAB12 | 66.1 | 1.00 | 0.85 | 0.49 | 0.66 | 0.64 | 1.00 |
| 10 | MAB21L3 | 65.6 | 1.00 | 1.00 | 0.32 | 0.79 | 0.58 | 1.00 |
| 11 | ZSWIM9 | 65.4 | 1.00 | 1.00 | 0.25 | 0.83 | 0.66 | 1.00 |
| 12 | THAP8 | 64.6 | 1.00 | 1.00 | 0.28 | 0.75 | 0.66 | 1.00 |
| 13 | TMEM35B | 64.3 | 1.00 | 1.00 | 0.29 | 0.74 | 0.62 | 1.00 |
| 14 | PNMA8A | 63.8 | 1.00 | 0.85 | 0.26 | 0.88 | 0.71 | 1.00 |
| 15 | LONRF3 | 63.7 | 1.00 | 0.85 | 0.44 | 0.81 | 0.40 | 1.00 |
| 16 | KIAA0408 | 63.3 | 1.00 | 0.85 | 0.26 | 0.87 | 0.69 | 1.00 |
| 17 | CIMIP6 | 63.3 | 1.00 | 0.70 | 0.52 | 0.69 | 0.59 | 1.00 |
| 18 | RIPOR3 | 63.0 | 1.00 | 1.00 | 0.38 | 0.51 | 0.64 | 1.00 |
| 19 | NOAZFP | 62.6 | 1.00 | 0.57 | 0.54 | 0.68 | 0.72 | 1.00 |
| 20 | PHLDB3 | 61.8 | 1.00 | 0.59 | 0.42 | 0.83 | 0.72 | 1.00 |

## 3. 代表蛋白

| 蛋白 | v4总分 | 覆盖 | 核定位 | 染色质 | 可靠性 | 功能未知 | 结构大小 | PPI | 纯度 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CRYBG2 | 79.1 | 1.00 | 1.00 | 0.70 | 0.83 | 0.66 | 0.60 | 27 | 0.63 |
| LRRC42 | 76.6 | 1.00 | 1.00 | 0.56 | 0.83 | 0.70 | 1.00 | 15 | 0.60 |
| C8orf74 | 76.3 | 1.00 | 1.00 | 0.63 | 0.74 | 0.62 | 1.00 | 8 | 0.73 |
| EFCAB5 | 68.5 | 1.00 | 0.72 | 0.61 | 0.78 | 0.67 | 0.67 | 14 | 0.68 |
| PNMA8A | 63.8 | 1.00 | 0.85 | 0.26 | 0.88 | 0.71 | 1.00 | 109 | 0.25 |
| NOAZFP | 62.6 | 1.00 | 0.57 | 0.54 | 0.68 | 0.72 | 1.00 | 411 | 0.48 |
| PRR3 | 57.3 | 1.00 | 0.85 | 0.09 | 0.86 | 0.70 | 1.00 | 212 | 0.10 |
| TEX35 | 58.6 | 0.75 | None | 0.92 | 0.87 | 0.69 | 1.00 | 34 | 0.82 |

## 4. 独立 QA

- 状态：**pass**；20项检查全部 pass。
- `unique_symbols`：True
- `input_sha256`：True
- `components_keys`：True
- `no_tier_keys`：True
- `score_recomputed`：True
- `coverage_recomputed`：True
- `upper_recomputed`：True
- `ranges`：True
- `sorted_desc`：True
- `top20`：True
- `tex35_not_top20`：True
- `tex35_below_60`：True
- `lrrc42_score`：True
- `no_abcd_strings`：True
- `ppi_edges`：True
- `shared_identity_cap`：True
- `novelty_direction`：True
- `znf814_unresolved`：True
- `noazfp_partial`：True
- `known_partner_accounting`：True

## 5. 发布

- 权威接口：`/home/hujiatong/protein_atlas/model_v1/outputs/priority497_v4_single_score_20261021/priority_interface.json`
- manifest 更新前副本：`/home/hujiatong/protein_atlas/model_v1/outputs/priority497_v4_single_score_20261021/manifest_before.json`
- 当前 phase：`new497_v4_single_priority_score_delivered_uncalibrated`；上一版 user497 接口保留为 `previous_user497_priority_interface`。

## 6. 边界

EpiFactors/GO/PubMed 仍属后验或研究关注度来源，不能当独立性能验证；A/B/C/D 已移除，但“总分高”不等于新机制已证明；人工审查仍默认 accept，拒绝不是生物学阴性。
