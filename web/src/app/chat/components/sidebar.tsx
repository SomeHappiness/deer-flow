// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { BookOpen, ChevronLeft, ChevronRight, MessageSquare, Plus, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";
import { Logo } from "~/components/deer-flow/logo";

/**
 * 侧栏组件
 * 
 * 类似ChatGPT的侧栏，支持展开/收起，主题色跟随系统
 * 包含新建对话、历史对话、设置等功能区
 * 
 * @param {object} props - 组件属性
 * @param {boolean} props.collapsed - 是否收起侧栏
 * @param {function} props.onToggle - 切换侧栏状态的回调
 * @param {string} [props.className] - 自定义CSS类名
 * @returns {JSX.Element} 侧栏组件
 */
export function Sidebar({ collapsed, onToggle, className }: {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}) {
  // 获取当前主题
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <aside
      className={cn(
        "h-full transition-all duration-300 flex flex-col",
        "border-r border-border shadow-sm",
        isDark ? "bg-[#202123] text-white" : "bg-[#f9f9fa] text-gray-800",
        collapsed ? "w-[70px]" : "w-[230px]",
        className
      )}
    >
      {/* 顶部Logo区域，字体和图标加大，间距缩小 */}
      <div className="flex items-center justify-center h-20 w-full pb-1">
        <Logo className="text-2xl md:text-3xl font-bold" />
      </div>
      {/* 新建对话按钮，紧贴Logo下方 */}
      <div className="pt-0 pb-3 px-3">
        <button 
          className={cn(
            "flex items-center gap-2 w-full rounded-md p-3 transition-colors text-base md:text-lg",
            "border border-border/60 hover:bg-gray-500/10",
            collapsed ? "justify-center" : ""
          )}
        >
          <Plus size={22} />
          {!collapsed && <span>新建对话</span>}
        </button>
      </div>

      {/* 对话历史 */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className={cn(
          "text-xs font-medium uppercase mb-2 mt-2",
          "text-gray-500 dark:text-gray-400",
          collapsed ? "text-center" : "px-1"
        )}>
          {!collapsed && "历史记录"}
          {collapsed && "历史"}
        </div>
        
        {/* 历史对话列表 - 可以从实际数据中循环生成 */}
        {[1, 2, 3].map((_, i) => (
          <button
            key={i}
            className={cn(
              "flex items-center gap-2 w-full rounded-md p-3 mb-1",
              "hover:bg-gray-500/10 transition-colors truncate",
              collapsed ? "justify-center" : ""
            )}
          >
            <MessageSquare size={16} />
            {!collapsed && <span className="truncate">北京冬奥会获得多少枚金牌？</span>}
          </button>
        ))}
      </div>

      {/* 底部内容 */}
      <div className={cn(
        "mt-auto border-t border-border/60 p-3",
        "flex flex-col gap-1"
      )}>
        {/* 帮助文档 */}
        {/* <button className={cn(
          "flex items-center gap-2 w-full rounded-md p-3",
          "hover:bg-gray-500/10 transition-colors",
          collapsed ? "justify-center" : ""
        )}>
          <BookOpen size={16} />
          {!collapsed && <span>帮助文档</span>}
        </button> */}
        
        {/* 设置 */}
        {/* <button className={cn(
          "flex items-center gap-2 w-full rounded-md p-3",
          "hover:bg-gray-500/10 transition-colors",
          collapsed ? "justify-center" : ""
        )}>
          <Settings size={16} />
          {!collapsed && <span>设置</span>}
        </button> */}
      </div>

      {/* 展开/收起按钮 */}
      <div className="flex justify-end p-3 pt-0">
        <button
          onClick={onToggle}
          className={cn(
            "rounded-md p-2 transition-colors",
            "hover:bg-gray-500/10",
            "text-gray-500 dark:text-gray-400"
          )}
          aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
} 