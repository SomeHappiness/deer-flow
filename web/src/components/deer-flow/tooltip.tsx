// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import type { CSSProperties } from "react";
import { useRef, useEffect, useState } from "react";

import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

/**
 * 提示框组件
 * 
 * 在用户与元素交互时显示额外信息的工具提示组件
 * 基于Shadcn UI库的Tooltip组件进行二次封装
 * 支持自定义样式、位置和内容
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @param {CSSProperties} [props.style] - 内联样式对象
 * @param {React.ReactNode} props.children - 要添加提示的子元素
 * @param {React.ReactNode} [props.title] - 提示内容
 * @param {boolean} [props.open] - 控制提示框是否显示
 * @param {string} [props.side] - 提示显示的位置：'left'|'right'|'top'|'bottom'
 * @param {number} [props.sideOffset] - 提示框偏移距离
 * @returns {JSX.Element} Tooltip组件
 */
export function Tooltip({
  className,
  style,
  children,
  title,
  open,
  side,
  sideOffset,
}: {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  title?: React.ReactNode;
  open?: boolean;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
}) {
  // 使用简单实现，避免 Popper 相关问题
  const [showFallbackTooltip, setShowFallbackTooltip] = useState(false);
  
  // 如果没有提供children，则不渲染
  if (!children) {
    return null;
  }
  
  // 如果没有提供title，则只渲染children
  if (!title) {
    return <>{children}</>;
  }
  
  try {
    // 尝试使用更简单的实现，不依赖于 PopperAnchor
    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShowFallbackTooltip(true)}
          onMouseLeave={() => setShowFallbackTooltip(false)}
        >
          {children}
        </div>
        {showFallbackTooltip && title && (
          <div
            className={cn(
              "absolute z-50 rounded-md bg-card px-3 py-1.5 text-sm shadow-md",
              side === "top" && "bottom-full mb-2",
              side === "bottom" && "top-full mt-2",
              side === "left" && "right-full mr-2",
              side === "right" && "left-full ml-2",
              !side && "top-full mt-2", // 默认显示在下方
              className
            )}
            style={style}
          >
            {title}
          </div>
        )}
      </div>
    );
  } catch (error) {
    // 发生错误时，直接返回子元素，不渲染tooltip
    console.error("Error rendering tooltip:", error);
    return <>{children}</>;
  }
}
