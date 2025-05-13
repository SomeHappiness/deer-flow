// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useMemo } from "react";

import { useStore } from "~/core/store";
import { cn } from "~/lib/utils";

import { MessagesBlock } from "./components/messages-block";
import { ResearchBlock } from "./components/research-block";

/**
 * 主页面组件
 * 
 * 负责整体布局和消息/研究区块的显示
 * 支持单列和双列两种显示模式
 * 
 * @returns {JSX.Element} 主页面组件
 */
export default function Main() {
  // 获取当前打开的研究ID
  const openResearchId = useStore((state) => state.openResearchId);
  
  // 根据是否有打开的研究决定是否使用双列模式
  const doubleColumnMode = useMemo(
    () => openResearchId !== null,
    [openResearchId],
  );
  
  return (
    <div
      className={cn(
        "flex h-full w-full justify-center px-4 pt-12 pb-4",
        doubleColumnMode && "gap-8", // 双列模式下添加间距
      )}
    >
      {/* 消息区块：显示对话内容 */}
      <MessagesBlock
        className={cn(
          "shrink-0 transition-all duration-300 ease-out",
          // 单列模式：消息区块居中显示
          !doubleColumnMode &&
            `w-[768px] translate-x-[min(calc((100vw-538px)*0.75/2),960px/2)]`,
          // 双列模式：消息区块固定宽度
          doubleColumnMode && `w-[538px]`,
        )}
      />
      
      {/* 研究区块：显示研究相关内容 */}
      <ResearchBlock
        className={cn(
          "w-[min(calc((100vw-538px)*0.75),960px)] pb-4 transition-all duration-300 ease-out",
          // 单列模式：隐藏研究区块
          !doubleColumnMode && "scale-0",
          // 双列模式：显示研究区块
          doubleColumnMode && "",
        )}
        researchId={openResearchId}
      />
    </div>
  );
}
