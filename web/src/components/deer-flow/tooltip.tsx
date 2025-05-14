// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import type { CSSProperties } from "react";
import { useRef, useEffect } from "react";

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
  // 组件挂载状态ref
  const isMountedRef = useRef(true);
  
  // 组件卸载时设置状态
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // 如果没有提供children或title，则不渲染tooltip
  if (!children) {
    return null;
  }
  
  try {
    // 不直接传递 open 属性，而是使用条件渲染
    return (
      <TooltipProvider>
        {open !== undefined ? (
          <ShadcnTooltip delayDuration={750} defaultOpen={open}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            {title && (
              <TooltipContent
                className={cn(className)}
                style={style}
                side={side}
                sideOffset={sideOffset}
              >
                {title}
              </TooltipContent>
            )}
          </ShadcnTooltip>
        ) : (
          <ShadcnTooltip delayDuration={750}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            {title && (
              <TooltipContent
                className={cn(className)}
                style={style}
                side={side}
                sideOffset={sideOffset}
              >
                {title}
              </TooltipContent>
            )}
          </ShadcnTooltip>
        )}
      </TooltipProvider>
    );
  } catch (error) {
    // 发生错误时，直接返回子元素，不渲染tooltip
    console.error("Error rendering tooltip:", error);
    return <>{children}</>;
  }
}
