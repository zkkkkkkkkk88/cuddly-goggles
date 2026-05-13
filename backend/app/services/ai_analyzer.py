import json
from openai import OpenAI
from app.core.config import settings
from app.core.schemas import AnalysisResult



ANALYSIS_SYSTEM_ZH = """你是一位资深简历分析师。分析提供的简历文本，返回 JSON：

- score: 整数 0-100
- strengths: 3-5 个优点（中文）
- weaknesses: 3-5 个问题（中文）
- ats_compatibility: ATS 兼容性描述，如"高 — ..."、"中 — ..."、"低 — ..."（中文）
- missing_keywords: 5-8 个缺失关键词（英文关键词，中文说明）
- improvement_suggestions: 5-8 条改进建议（中文）
- optimized_resume: 此项留空字符串 ""

只返回有效 JSON。"""


ANALYSIS_USER_ZH = "请分析这份简历：\n\n{resume_text}"

# Chinese optimization — senior interviewer perspective
OPTIMIZE_SYSTEM_ZH = (
    "你是一位资深面试官和招聘经理，看过上万份简历。"
    "你的任务是把一份普通简历优化成能让面试官眼前一亮的版本，同时在原文基础上进行改写。\n\n"
    "=== 你要主动做这些 ===\n"
    "1. 把一句话的描述拓展成 2-3 句，补充合理的工作细节（基于岗位常识推断）。\n"
    "   例如：'负责后台开发' → '负责后台服务的设计与开发，参与需求评审、接口设计、数据库表结构搭建和代码实现'\n"
    "2. 把啰嗦冗长的句子缩短，提炼核心信息。\n"
    "3. 把多个弱相关的点合并成一条有力的描述。\n"
    "4. 把'做了什么'改写为'做到了什么、用什么技术、产生了什么价值'。\n"
    "   例如：'用 Spring Boot 做了学生管理系统' → '独立开发学生管理系统：基于 Spring Boot + MySQL 搭建后端，实现学生信息的增删改查与分页查询，采用 RESTful API 设计，前后端分离部署'\n"
    "5. 为你推断的合理技术细节使用精确术语（如'接口'→'RESTful API'，'数据库'→'MySQL 关系型数据库'），但不能编造原文没提到的技术栈。\n"
    "6. 优化板块标题，让结构一目了然。\n"
    "7. 为每个项目经历写上'技术栈：XXX'一行。\n\n"
    "=== 你绝对不能做 ===\n"
    "1. 不编造原文没有的奖项、荣誉、排名、竞赛。\n"
    "2. 不编造联系方式、邮箱、电话、LinkedIn、GitHub。\n"
    "3. 不编造 GPA、绩点、分数。\n"
    "4. 不编造具体的量化数字（如'提升 40%''增加 500 万'），但可以说'显著提升''有效改善'这类定性描述。\n"
    "5. 不添加原文没提到的技术、工具、框架。但可以把原文提到的技术写得更完整（如'Spring Boot'可以写为'Spring Boot 框架'）。\n"
    "6. 不添加原文没有的职位、公司名称、起止日期。\n"
    "7. 不添加原文没有的证书名称。\n"
    "8. 不把学生/实习生的水平拔高成资深/管理层。\n"
    "9. 不删除原文的任何事实信息，只能优化表达方式。\n\n"
    "=== 优化力度示例 ===\n"
    "【项目经历】\n"
    "原文：'学生管理系统，用 Spring Boot+MySQL 做了个学生信息管理系统，能增删改查，前后端分离'\n"
    "好的优化：'学生管理系统 | 技术栈：Spring Boot + MySQL\n"
    "独立开发前后端分离的学生信息管理平台。后端基于 Spring Boot 框架构建 RESTful API，实现学生信息的增删改查、条件筛选与分页查询功能；"
    "数据库采用 MySQL 关系型数据库，设计了规范的表结构与索引方案。前端对接 RESTful 接口完成数据展示与交互。'\n\n"
    "【实习经历】\n"
    "原文：'2025年暑假在某软件公司实习，Java后端开发，写了一些接口和SQL'\n"
    "好的优化：'某软件公司 | Java 后端开发实习生 | 2025年7月–9月\n"
    "参与公司业务系统的后端开发工作。根据产品需求文档编写 RESTful 风格的数据接口，"
    "负责数据库查询语句的编写与性能优化，配合前端开发人员完成接口联调与功能测试，"
    "确保数据交互的准确性和响应效率。'\n\n"
    "只输出优化后的简历文本。不要任何解释，不要 markdown 标记。"
)

OPTIMIZE_USER_ZH = "请从资深面试官的角度优化以下简历，充分拓展每条经历的描述，让表述更具说服力：\n\n{resume_text}"


def _get_client() -> OpenAI:
    return OpenAI(
        api_key=settings.DEEPSEEK_API_KEY,
        base_url=settings.DEEPSEEK_BASE_URL,
    )


def _ai_optimize_zh(resume_text: str) -> str:
    """AI optimization for Chinese resumes — few-shot prompt keeps it grounded."""
    client = _get_client()

    response = client.chat.completions.create(
        model=settings.DEEPSEEK_MODEL,
        messages=[
            {"role": "system", "content": OPTIMIZE_SYSTEM_ZH},
            {"role": "user", "content": OPTIMIZE_USER_ZH.format(resume_text=resume_text)},
        ],
        temperature=0.4,
        max_tokens=8192,
    )

    content = response.choices[0].message.content
    if not content or len(content.strip()) < 20:
        raise ValueError(f"AI optimization returned insufficient content ({len(content) if content else 0} chars)")

    return content.strip()


def analyze_resume(resume_text: str) -> AnalysisResult:
    """Analyze resume via DeepSeek API, then generate an optimized version."""
    client = _get_client()

    # Step 1: Analysis
    system_prompt = ANALYSIS_SYSTEM_ZH
    user_prompt = ANALYSIS_USER_ZH.format(resume_text=resume_text)

    response = client.chat.completions.create(
        model=settings.DEEPSEEK_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
        max_tokens=4096,
    )

    raw_content = response.choices[0].message.content.strip()
    if raw_content.startswith("```"):
        raw_content = raw_content.split("\n", 1)[1]
        if raw_content.endswith("```"):
            raw_content = raw_content[:-3]

    data = json.loads(raw_content)
    result = AnalysisResult(**data)

    # Step 2: Generate optimized resume
    try:
        result.optimized_resume = _ai_optimize_zh(resume_text)
    except Exception:
        from app.utils.resume_formatter import format_resume
        result.optimized_resume = format_resume(resume_text)

    return result
