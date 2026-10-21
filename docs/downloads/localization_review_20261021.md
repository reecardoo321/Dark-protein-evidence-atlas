# 核定位与候选范围复审：2026-10-21

本轮已完成官方定位/图像索引和已有结构元数据的收集；用户确认后，仅对现有497个new另行重排，详见priority497_methods_20261021.md。原716与旧分数保留。**图像收集和自动描述分类不等于逐图人工定位确认。**

## 1. L1只有二十多个的原因

|名单|历史L1|历史L2|历史L3|历史L0|
|---|---:|---:|---:|---:|
|全716|46|352|239|79|
|最新保留497|21|238|166|72|

历史L1=原冻结记录里HPA Enhanced/Supported的核相关标注，或同一UniProt定位条目中有ECO:0000269；L2主要为HPA Approved；L3含推断/衍生来源；L0是历史未解决。它是来源规则，不是“属于核蛋白的概率”，也没有区分核为主定位、附加定位、穿梭或核膜。强证据分层会受已有研究充分程度影响，不能据此说497中只有21个核蛋白。

最初总表确实含tier 1–4、HPA定位/可靠性、COMPARTMENTS证据和带ECO码的UniProt定位。**原始字段可以逐基因作为证据使用，但tier数字不能直接替代L1–L3或当作定位置信概率。**精确HGNC联接找回716中的530个基因的源行；其余主要来自后来扩展来源，原表没有相应可确认行。

明确反例：ANHX原tier1，但原定位只有UniProt规则推断ECO:0000255及COMPARTMENTS IBA；C1orf52原tier4，却有HPA Enhanced核质定位。ACOXL历史L1也同时标注胞质和核仁，不能自动称主要核内。因此不能简单“把原tier1全升级，tier4全降级”。原表tier语义的生成代码未在已授权冻结副本中找到，不猜其完整定义；原值和来源断言已一并展示。

THAP6是另一个例子：本轮官方HPA记录主要定位为centrosome，附加为nucleoplasm；有核内观察不等于严格核内主定位。该例提示要审查主/附加位置与具体抗体、细胞系，而不只搜索Nucleus字符串。

## 2. 用户澄清：只复审现有new497

ZNF是定位分层不合理的举例，不是要求扩增ZNF或DNA结合名单。当前仅在497中复审定位/重排，716留待用户后续重新审查。原全范围ZNF审计作为历史诊断附件，不作为本次候选准入或扩增决定。ZNF814有核质信号及多基因抗体警示同时保留；无IF者不称非核。

## 3. 当前官方数据覆盖

- AF结构元数据覆盖716/716；715个至少有一个与冻结查询全长序列SHA256一致的模型。LACTBL1的当前AF序列与冻结版本不同，明确标为当前版本展示，不替换历史结构计算。
- HPA IF样本图覆盖585/716，共3979张已索引官方人类细胞样本图，保留抗体、细胞系、位置、验证等级、比例尺和原始URL。按原记录顺序展示，不筛选更像核内的图。未有图像的基因保留，无图不当作阴性。
- 当前UniProt中有21个候选具有成员级核定位ECO:0000269条目；不能与HPA计数直接相加，来源可能重叠。
- 当前HPA描述：{"no_IF_annotation": 131, "non_nuclear_IF": 37, "nuclear_main_only": 361, "nuclear_additional": 97, "mixed_main": 90}。这是主/附加定位的自动来源摘要，不是新置信分级或人工结论。
- 原生收集总任务1445，成功1426；19个查询没有成功响应，逐项保留，不当作官方无图/无定位。其他空白可能确实未做IF，需要区分。

HPA图像采用官方原图URL按需加载，外部图片服务不可达时保留原页入口。AF坐标从官方来源按需加载到浏览器三维查看器，不重新预测；pLDDT不是功能或定位概率。HPA抗体的潜在家族交叉反应不能靠同源序列消除；没有把FAM156A/B的证据合并为独立复现。

## 4. 用户已接受并执行的497评分

权重为核定位25、染色质/表观遗传35、关联可靠性20、机制机会15、实验便利5。83个来源规则内的核内＋染色质优先核验候选，代表建议82；全部497保留，家族/身份/已有机制与缺失单列。完整公式、分量、敏感性和未解决问题见priority497_methods_20261021.md。分数不是阳性率，图像未被声称人工审完。

## 来源与解释依据

- [HPA亚细胞定位资源](https://www.proteinatlas.org/humanproteome/subcellular/organelle)：多定位与可靠性含义。
- [HPA程序化访问](https://www.proteinatlas.org/about/help/dataaccess)与[IF图片字段说明](https://www.proteinatlas.org/about/help)：官方XML、细胞系/抗体及样本原图。
- HPA图像：Image credit: Human Protein Atlas, CC BY 4.0，具体图片/版本来源链接在每条记录；[Thul et al., Science 2017](https://doi.org/10.1126/science.aal3321)；[许可](https://www.proteinatlas.org/about/licence)。
- [AlphaFold DB FAQ](https://alphafold.ebi.ac.uk/faq)：已有预测及结构解释限制；每个模型保留官方元数据和坐标来源。
- [Bias-aware training and evaluation, PNAS 2025](https://doi.org/10.1073/pnas.2416646122)：PPI度和研究充分程度会干扰评价，不能把度高直接当功能更可信。
- [Combinatorial CRISPR screen, Nature Communications 2021](https://www.nature.com/articles/s41467-021-21478-9)：旁系基因补偿/冗余需要特定背景与实验，不是同家族即完全等功能。

原始总表、科学图、原候选顺序、旧分数和冻结包均保持不变；本轮添加来源审查层及另存版本的new497后验优先级，未扩大候选池。
