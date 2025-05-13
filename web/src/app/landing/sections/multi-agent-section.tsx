// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { MultiAgentVisualization } from "../components/multi-agent-visualization";
import { SectionHeader } from "../components/section-header";

/**
 * 多智能体架构区块组件
 * 
 * 展示多智能体协作架构的可视化演示
 * @returns {JSX.Element} 多智能体架构区块
 */
export function MultiAgentSection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center">
      {/* 区块标题 */}
      <SectionHeader
        anchor="multi-agent-architecture"
        title="Multi-Agent Architecture"
        description="Experience the agent teamwork with our Supervisor + Handoffs design pattern."
      />
      {/* 可视化演示区域 */}
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <div className="h-full w-full">
          <MultiAgentVisualization />
        </div>
      </div>
    </section>
  );
}
