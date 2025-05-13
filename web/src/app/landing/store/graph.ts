// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import type { Edge, Node } from "@xyflow/react";
import {
  Brain,
  FilePen,
  MessageSquareQuote,
  Microscope,
  SquareTerminal,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * 流程图节点类型
 * 继承自ReactFlow的Node，扩展了label、icon和active属性
 */
export type GraphNode = Node<{
  label: string;
  icon?: LucideIcon;
  active?: boolean;
}>;

/**
 * 流程图数据结构
 * 包含节点和边的数组
 */
export type Graph = {
  nodes: GraphNode[];
  edges: Edge[];
};

// 行高常量，用于计算节点垂直位置
const ROW_HEIGHT = 85;
const ROW_1 = 0;
const ROW_2 = ROW_HEIGHT;
const ROW_3 = ROW_HEIGHT * 2;
const ROW_4 = ROW_HEIGHT * 2;
const ROW_5 = ROW_HEIGHT * 3;
const ROW_6 = ROW_HEIGHT * 4;

/**
 * 多智能体流程图数据
 * 定义了完整的节点和边结构，用于可视化展示
 */
export const graph: Graph = {
  nodes: [
    // 起始节点
    {
      id: "Start",
      type: "circle",
      data: { label: "Start" },
      position: { x: -75, y: ROW_1 },
    },
    // 协调者节点
    {
      id: "Coordinator",
      data: { icon: MessageSquareQuote, label: "Coordinator" },
      position: { x: 150, y: ROW_1 },
    },
    // 规划者节点
    {
      id: "Planner",
      data: { icon: Brain, label: "Planner" },
      position: { x: 150, y: ROW_2 },
    },
    // 报告者节点
    {
      id: "Reporter",
      data: { icon: FilePen, label: "Reporter" },
      position: { x: 275, y: ROW_3 },
    },
    // 人工反馈节点
    {
      id: "HumanFeedback",
      data: { icon: UserCheck, label: "Human Feedback" },
      position: { x: 25, y: ROW_4 },
    },
    // 研究团队节点
    {
      id: "ResearchTeam",
      data: { icon: Users, label: "Research Team" },
      position: { x: 25, y: ROW_5 },
    },
    // 研究者节点
    {
      id: "Researcher",
      data: { icon: Microscope, label: "Researcher" },
      position: { x: -75, y: ROW_6 },
    },
    // 编码者节点
    {
      id: "Coder",
      data: { icon: SquareTerminal, label: "Coder" },
      position: { x: 125, y: ROW_6 },
    },
    // 结束节点
    {
      id: "End",
      type: "circle",
      data: { label: "End" },
      position: { x: 330, y: ROW_6 },
    },
  ],
  edges: [
    // 起始到协调者的边
    {
      id: "Start->Coordinator",
      source: "Start",
      target: "Coordinator",
      sourceHandle: "right",
      targetHandle: "left",
      animated: true,
    },
    // 协调者到规划者的边
    {
      id: "Coordinator->Planner",
      source: "Coordinator",
      target: "Planner",
      sourceHandle: "bottom",
      targetHandle: "top",
      animated: true,
    },
    // 规划者到报告者的边
    {
      id: "Planner->Reporter",
      source: "Planner",
      target: "Reporter",
      sourceHandle: "right",
      targetHandle: "top",
      animated: true,
    },
    // 规划者到人工反馈的边
    {
      id: "Planner->HumanFeedback",
      source: "Planner",
      target: "HumanFeedback",
      sourceHandle: "left",
      targetHandle: "top",
      animated: true,
    },
    // 人工反馈到规划者的边
    {
      id: "HumanFeedback->Planner",
      source: "HumanFeedback",
      target: "Planner",
      sourceHandle: "right",
      targetHandle: "bottom",
      animated: true,
    },
    // 人工反馈到研究团队的边
    {
      id: "HumanFeedback->ResearchTeam",
      source: "HumanFeedback",
      target: "ResearchTeam",
      sourceHandle: "bottom",
      targetHandle: "top",
      animated: true,
    },
    // 报告者到结束的边
    {
      id: "Reporter->End",
      source: "Reporter",
      target: "End",
      sourceHandle: "bottom",
      targetHandle: "top",
      animated: true,
    },
    // 研究团队到研究者的边
    {
      id: "ResearchTeam->Researcher",
      source: "ResearchTeam",
      target: "Researcher",
      sourceHandle: "left",
      targetHandle: "top",
      animated: true,
    },
    // 研究团队到编码者的边
    {
      id: "ResearchTeam->Coder",
      source: "ResearchTeam",
      target: "Coder",
      sourceHandle: "bottom",
      targetHandle: "left",
      animated: true,
    },
    // 研究团队到规划者的边
    {
      id: "ResearchTeam->Planner",
      source: "ResearchTeam",
      target: "Planner",
      sourceHandle: "right",
      targetHandle: "bottom",
      animated: true,
    },
    // 研究者到研究团队的边
    {
      id: "Researcher->ResearchTeam",
      source: "Researcher",
      target: "ResearchTeam",
      sourceHandle: "right",
      targetHandle: "bottom",
      animated: true,
    },
    // 编码者到研究团队的边
    {
      id: "Coder->ResearchTeam",
      source: "Coder",
      target: "ResearchTeam",
      sourceHandle: "top",
      targetHandle: "right",
      animated: true,
    },
  ],
};
