// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

/**
 * 多智能体协作流程剧本
 * 定义了完整的协作步骤，包括每个步骤的描述、激活的节点和边
 */
export const playbook = {
  steps: [
    // 步骤1：协调者与用户交互
    {
      description:
        "The Coordinator is responsible for engaging with the user to understand their problem and requirements.",
      activeNodes: ["Start", "Coordinator"],
      activeEdges: ["Start->Coordinator"],
      tooltipPosition: "right",
    },
    // 步骤2：协调者将任务交给规划者
    {
      description:
        "If the user's problem is clearly defined, the Coordinator will hand it over to the Planner.",
      activeNodes: ["Coordinator", "Planner"],
      activeEdges: ["Coordinator->Planner"],
      tooltipPosition: "left",
    },
    // 步骤3：等待人工反馈
    {
      description: "Awaiting human feedback to refine the plan.",
      activeNodes: ["Planner", "HumanFeedback"],
      activeEdges: ["Planner->HumanFeedback"],
      tooltipPosition: "left",
    },
    // 步骤4：根据反馈更新计划
    {
      description: "Updating the plan based on human feedback.",
      activeNodes: ["HumanFeedback", "Planner"],
      activeEdges: ["HumanFeedback->Planner"],
      tooltipPosition: "left",
    },
    // 步骤5：研究团队执行核心研究任务
    {
      description:
        "The Research Team is responsible for conducting the core research tasks.",
      activeNodes: ["Planner", "HumanFeedback", "ResearchTeam"],
      activeEdges: [
        "Planner->HumanFeedback",
        "HumanFeedback->ResearchTeam",
        "ResearchTeam->HumanFeedback",
      ],
      tooltipPosition: "left",
    },
    // 步骤6：研究者使用搜索和爬虫工具
    {
      description:
        "The Researcher is responsible for gathering information using search and crawling tools.",
      activeNodes: ["ResearchTeam", "Researcher"],
      activeEdges: ["ResearchTeam->Researcher", "Researcher->ResearchTeam"],
      tooltipPosition: "left",
    },
    // 步骤7：编码者编写Python代码
    {
      description:
        "The Coder is responsible for writing Python code to solve math problems, data analysis, and more.",
      tooltipPosition: "right",
      activeNodes: ["ResearchTeam", "Coder"],
      activeEdges: ["ResearchTeam->Coder", "Coder->ResearchTeam"],
    },
    // 步骤8：研究团队向规划者汇报
    {
      description:
        "Once the research tasks are completed, the Researcher will hand over to the Planner.",
      activeNodes: ["ResearchTeam", "Planner"],
      activeEdges: ["ResearchTeam->Planner"],
      tooltipPosition: "left",
    },
    // 步骤9：规划者向报告者交接
    {
      description:
        "If no additional information is required, the Planner will handoff to the Reporter.",
      activeNodes: ["Reporter", "Planner"],
      activeEdges: ["Planner->Reporter"],
      tooltipPosition: "right",
    },
    // 步骤10：报告者准备总结报告
    {
      description:
        "The Reporter will prepare a report summarizing the results.",
      activeNodes: ["End", "Reporter"],
      activeEdges: ["Reporter->End"],
      tooltipPosition: "bottom",
    },
  ],
};
