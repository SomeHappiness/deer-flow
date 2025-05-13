// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";
import { FastForward, Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { RainbowText } from "~/components/deer-flow/rainbow-text";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { fastForwardReplay } from "~/core/api";
import { useReplayMetadata } from "~/core/api/hooks";
import type { Option } from "~/core/messages";
import { useReplay } from "~/core/replay";
import { sendMessage, useStore } from "~/core/store";
import { env } from "~/env";
import { cn } from "~/lib/utils";

import { ConversationStarter } from "./conversation-starter";
import { InputBox } from "./input-box";
import { MessageListView } from "./message-list-view";
import { Welcome } from "./welcome";

/**
 * 消息区块组件
 * 
 * 主要消息显示和交互区域，包含消息列表和输入框
 * 支持普通对话模式和回放模式
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @returns {JSX.Element} 消息区块组件
 */
export function MessagesBlock({ className }: { className?: string }) {
  // 获取消息数量和响应状态
  const messageCount = useStore((state) => state.messageIds.length);
  const responding = useStore((state) => state.responding);
  
  // 获取回放状态和元数据
  const { isReplay } = useReplay();
  const { title: replayTitle, hasError: replayHasError } = useReplayMetadata();
  
  // 回放控制状态
  const [replayStarted, setReplayStarted] = useState(false);
  
  // 用于中止请求的控制器
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // 反馈状态管理
  const [feedback, setFeedback] = useState<{ option: Option } | null>(null);

  /**
   * 处理发送消息
   * 
   * 创建中止控制器并发送消息
   * 支持处理反馈和中断功能
   * 
   * @param {string} message - 消息内容
   * @param {object} options - 选项对象
   */
  const handleSend = useCallback(
    async (message: string, options?: { interruptFeedback?: string }) => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      try {
        await sendMessage(
          message,
          {
            interruptFeedback:
              options?.interruptFeedback ?? feedback?.option.value,
          },
          {
            abortSignal: abortController.signal,
          },
        );
      } catch {}
    },
    [feedback],
  );
  
  /**
   * 处理取消响应
   * 
   * 中止当前进行中的请求
   */
  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);
  
  /**
   * 处理反馈选择
   * 
   * 设置用户选择的反馈选项
   * 
   * @param {object} feedback - 反馈对象
   */
  const handleFeedback = useCallback(
    (feedback: { option: Option }) => {
      setFeedback(feedback);
    },
    [setFeedback],
  );
  
  /**
   * 处理移除反馈
   * 
   * 清除当前反馈状态
   */
  const handleRemoveFeedback = useCallback(() => {
    setFeedback(null);
  }, [setFeedback]);
  
  /**
   * 处理开始回放
   * 
   * 设置回放状态并发送空消息开始回放
   */
  const handleStartReplay = useCallback(() => {
    setReplayStarted(true);
    void sendMessage();
  }, [setReplayStarted]);
  
  /**
   * 处理快进回放
   * 
   * 切换快进状态并调用API快进回放
   */
  const [fastForwarding, setFastForwarding] = useState(false);
  const handleFastForwardReplay = useCallback(() => {
    setFastForwarding(!fastForwarding);
    fastForwardReplay(!fastForwarding);
  }, [fastForwarding]);
  
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* 消息列表部分 */}
      <MessageListView
        className="flex flex-grow"
        onFeedback={handleFeedback}
        onSendMessage={handleSend}
      />
      
      {/* 根据模式显示不同的底部区域 */}
      {!isReplay ? (
        // 常规模式：显示输入框和对话启动器
        <div className="relative flex h-42 shrink-0 pb-4">
          {!responding && messageCount === 0 && (
            <ConversationStarter
              className="absolute top-[-218px] left-0"
              onSend={handleSend}
            />
          )}
          <InputBox
            className="h-full w-full"
            responding={responding}
            feedback={feedback}
            onSend={handleSend}
            onCancel={handleCancel}
            onRemoveFeedback={handleRemoveFeedback}
          />
        </div>
      ) : (
        // 回放模式：显示回放控制界面
        <>
          <div
            className={cn(
              "fixed bottom-[calc(50vh+80px)] left-0 transition-all duration-500 ease-out",
              replayStarted && "pointer-events-none scale-150 opacity-0",
            )}
          >
            <Welcome />
          </div>
          <motion.div
            className="mb-4 h-fit w-full items-center justify-center"
            initial={{ opacity: 0, y: "20vh" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={cn(
                "w-full transition-all duration-300",
                !replayStarted && "translate-y-[-40vh]",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <CardHeader>
                    <CardTitle>
                      <RainbowText animated={responding}>
                        {responding ? "Replaying" : `${replayTitle}`}
                      </RainbowText>
                    </CardTitle>
                    <CardDescription>
                      <RainbowText animated={responding}>
                        {responding
                          ? "DeerFlow is now replaying the conversation..."
                          : replayStarted
                            ? "The replay has been stopped."
                            : `You're now in DeerFlow's replay mode. Click the "Play" button on the right to start.`}
                      </RainbowText>
                    </CardDescription>
                  </CardHeader>
                </div>
                {!replayHasError && (
                  <div className="pr-4">
                    {responding && (
                      <Button
                        className={cn(fastForwarding && "animate-pulse")}
                        variant={fastForwarding ? "default" : "outline"}
                        onClick={handleFastForwardReplay}
                      >
                        <FastForward size={16} />
                        Fast Forward
                      </Button>
                    )}
                    {!replayStarted && (
                      <Button className="w-24" onClick={handleStartReplay}>
                        <Play size={16} />
                        Play
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
            {/* 静态网站演示模式提示 */}
            {!replayStarted && env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && (
              <div className="text-muted-foreground w-full text-center text-xs">
                * This site is for demo purposes only. If you want to try your
                own question, please{" "}
                <a
                  className="underline"
                  href="https://github.com/bytedance/deer-flow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here
                </a>{" "}
                to clone it locally and run it.
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
