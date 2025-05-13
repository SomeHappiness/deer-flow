// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { useCallback, useRef } from "react";

import { LoadingAnimation } from "~/components/deer-flow/loading-animation";
import { Markdown } from "~/components/deer-flow/markdown";
import ReportEditor from "~/components/editor";
import { useReplay } from "~/core/replay";
import { useMessage, useStore } from "~/core/store";
import { cn } from "~/lib/utils";

/**
 * 研究报告块组件
 * 
 * 用于显示研究报告内容，包括加载状态和编辑功能
 * 支持实时流式内容显示和编辑功能
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string} props.researchId - 研究ID，用于关联研究内容
 * @param {string} props.messageId - 消息ID，用于获取具体消息内容
 * @returns {JSX.Element} 研究报告块组件
 */
export function ResearchReportBlock({
  className,
  messageId,
}: {
  className?: string;
  researchId: string;
  messageId: string;
}) {
  // 获取消息内容
  const message = useMessage(messageId);
  // 检查是否处于回放模式
  const { isReplay } = useReplay();
  
  /**
   * 处理Markdown内容变更的回调函数
   * 
   * 当用户编辑报告内容时更新消息状态
   * 使用对象复制避免直接修改状态，防止潜在的渲染循环问题
   * 
   * @param {string} markdown - 新的Markdown内容
   */
  const handleMarkdownChange = useCallback(
    (markdown: string) => {
      if (message && message.content !== markdown) {
        const updatedMessage = { ...message, content: markdown };
        useStore.setState((state) => ({
          messages: new Map(state.messages).set(
            updatedMessage.id,
            updatedMessage,
          ),
        }));
      }
    },
    [message],
  );
  
  // 内容区域的引用，用于可能的滚动功能
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 判断内容是否已完成加载
  const isCompleted = message?.isStreaming === false && message?.content !== "";
  
  // TODO: 完成时滚动到顶部的功能，目前未实现
  // useEffect(() => {
  //   if (isCompleted && contentRef.current) {
  //     setTimeout(() => {
  //       contentRef
  //         .current!.closest("[data-radix-scroll-area-viewport]")
  //         ?.scrollTo({
  //           top: 0,
  //           behavior: "smooth",
  //         });
  //     }, 500);
  //   }
  // }, [isCompleted]);

  return (
    <div
      ref={contentRef}
      className={cn("relative flex flex-col pt-4 pb-8", className)}
    >
      {/* 根据状态显示编辑器或预览界面 */}
      {!isReplay && isCompleted ? (
        <ReportEditor
          content={message?.content}
          onMarkdownChange={handleMarkdownChange}
        />
      ) : (
        <>
          <Markdown animated>{message?.content}</Markdown>
          {message?.isStreaming && <LoadingAnimation className="my-12" />}
        </>
      )}
    </div>
  );
}
