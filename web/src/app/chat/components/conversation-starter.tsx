// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";

import { cn } from "~/lib/utils";

import { Welcome } from "./welcome";

/**
 * 预设的对话启动问题列表
 * 
 * 用于展示给用户作为对话起始点的示例问题
 */
const questions = [
  "How many times taller is the Eiffel Tower than the tallest building in the world?",
  "How many years does an average Tesla battery last compared to a gasoline engine?",
  "How many liters of water are required to produce 1 kg of beef?",
  "How many times faster is the speed of light compared to the speed of sound?",
];

/**
 * 对话启动器组件
 * 
 * 在对话开始时显示，提供预设问题列表供用户选择
 * 包含欢迎界面和问题卡片列表，带有动画效果
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @param {function} [props.onSend] - 选择问题时的回调函数
 * @returns {JSX.Element} 对话启动器组件
 */
export function ConversationStarter({
  className,
  onSend,
}: {
  className?: string;
  onSend?: (message: string) => void;
}) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* 欢迎组件，固定在屏幕中央 */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <Welcome className="pointer-events-auto mb-15 w-[75%] -translate-y-24" />
      </div>
      
      {/* 预设问题列表 */}
      <ul className="flex flex-wrap">
        {questions.map((question, index) => (
          <motion.li
            key={question}
            className="flex w-1/2 shrink-0 p-2 active:scale-105"
            style={{ transition: "all 0.2s ease-out" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.2,
              delay: index * 0.1 + 0.5,
              ease: "easeOut",
            }}
          >
            <div
              className="bg-card text-muted-foreground cursor-pointer rounded-2xl border px-4 py-4 opacity-75 transition-all duration-300 hover:opacity-100 hover:shadow-md"
              onClick={() => {
                onSend?.(question);
              }}
            >
              {question}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
