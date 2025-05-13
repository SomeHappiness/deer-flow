// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { useEffect, useImperativeHandle, useRef, type ReactNode, type RefObject } from "react";
import { useStickToBottom } from "use-stick-to-bottom";

import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

/**
 * ScrollContainer组件属性接口
 * 
 * @interface ScrollContainerProps
 * @property {string} [className] - 自定义CSS类名
 * @property {ReactNode} [children] - 子元素
 * @property {boolean} [scrollShadow=true] - 是否显示滚动阴影
 * @property {string} [scrollShadowColor="var(--background)"] - 滚动阴影颜色
 * @property {boolean} [autoScrollToBottom=false] - 是否自动滚动到底部
 * @property {RefObject<ScrollContainerRef | null>} [ref] - 引用对象
 */
export interface ScrollContainerProps {
  className?: string;
  children?: ReactNode;
  scrollShadow?: boolean;
  scrollShadowColor?: string;
  autoScrollToBottom?: boolean;
  ref?: RefObject<ScrollContainerRef | null>;
}

/**
 * ScrollContainer引用接口
 * 
 * @interface ScrollContainerRef
 * @property {function} scrollToBottom - 滚动到底部的方法
 */
export interface ScrollContainerRef {
  scrollToBottom(): void;
}

/**
 * 滚动容器组件
 * 
 * 提供可滚动区域，支持自动滚动到底部、滚动阴影等功能
 * 可用于聊天界面、日志显示等需要滚动的场景
 * 
 * @param {ScrollContainerProps} props - 组件属性
 * @returns {JSX.Element} 滚动容器组件
 */
export function ScrollContainer({
  className,
  children,
  scrollShadow = true,
  scrollShadowColor = "var(--background)",
  autoScrollToBottom = false,
  ref
}: ScrollContainerProps) {
  // 使用useStickToBottom钩子实现滚动到底部功能
  const { scrollRef, contentRef, scrollToBottom, isAtBottom } = useStickToBottom({ initial: "instant" });
  
  /**
   * 向父组件暴露scrollToBottom方法
   * 只有当内容已经处于底部时，才执行滚动操作
   */
  useImperativeHandle(ref, () => ({
    scrollToBottom() {
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  }));

  // 临时存储滚动引用，用于处理autoScrollToBottom变化
  const tempScrollRef = useRef<HTMLElement>(null);
  const tempContentRef = useRef<HTMLElement>(null);
  
  /**
   * 根据autoScrollToBottom属性控制是否启用自动滚动功能
   * 当不需要自动滚动时，暂存引用并将当前引用设为null
   * 当需要自动滚动时，恢复之前暂存的引用
   */
  useEffect(() => {
    if (!autoScrollToBottom) {
      tempScrollRef.current = scrollRef.current;
      tempContentRef.current = contentRef.current;
      scrollRef.current = null;
      contentRef.current = null;
    } else if (tempScrollRef.current && tempContentRef.current) {
      scrollRef.current = tempScrollRef.current;
      contentRef.current = tempContentRef.current;
    }
  }, [autoScrollToBottom, contentRef, scrollRef]);

  return (
    <div className={cn("relative", className)}>
      {/* 滚动阴影效果 */}
      {scrollShadow && (
        <>
          {/* 顶部渐变阴影 */}
          <div
            className={cn(
              "absolute top-0 right-0 left-0 z-10 h-10 bg-gradient-to-t",
              `from-transparent to-[var(--scroll-shadow-color)]`,
            )}
            style={
              {
                "--scroll-shadow-color": scrollShadowColor,
              } as React.CSSProperties
            }
          ></div>
          {/* 底部渐变阴影 */}
          <div
            className={cn(
              "absolute right-0 bottom-0 left-0 z-10 h-10 bg-gradient-to-b",
              `from-transparent to-[var(--scroll-shadow-color)]`,
            )}
            style={
              {
                "--scroll-shadow-color": scrollShadowColor,
              } as React.CSSProperties
            }
          ></div>
        </>
      )}
      {/* 滚动区域 */}
      <ScrollArea ref={scrollRef} className="h-full w-full">
        <div className="h-fit w-full" ref={contentRef}>
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
