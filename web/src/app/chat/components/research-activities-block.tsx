// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { PythonOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { LRUCache } from "lru-cache";
import { BookOpenText, PencilRuler, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { FavIcon } from "~/components/deer-flow/fav-icon";
import Image from "~/components/deer-flow/image";
import { LoadingAnimation } from "~/components/deer-flow/loading-animation";
import { Markdown } from "~/components/deer-flow/markdown";
import { RainbowText } from "~/components/deer-flow/rainbow-text";
import { Tooltip } from "~/components/deer-flow/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Skeleton } from "~/components/ui/skeleton";
import { findMCPTool } from "~/core/mcp";
import type { ToolCallRuntime } from "~/core/messages";
import { useMessage, useStore } from "~/core/store";
import { parseJSON } from "~/core/utils";
import { cn } from "~/lib/utils";

/**
 * 研究活动区块组件
 * 
 * 显示研究过程中的活动历史记录
 * 包括消息内容和工具调用结果
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string} props.researchId - 研究ID，用于获取相关活动
 * @returns {JSX.Element} 研究活动区块组件
 */
export function ResearchActivitiesBlock({
  className,
  researchId,
}: {
  className?: string;
  researchId: string;
}) {
  // 获取活动ID列表
  const activityIds = useStore((state) =>
    state.researchActivityIds.get(researchId),
  )!;
  
  // 检查研究是否仍在进行中
  const ongoing = useStore((state) => state.ongoingResearchId === researchId);
  
  return (
    <>
      {/* 活动列表 */}
      <ul className={cn("flex flex-col py-4", className)}>
        {activityIds.map(
          (activityId, i) =>
            i !== 0 && (
              <motion.li
                key={activityId}
                style={{ transition: "all 0.4s ease-out" }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <ActivityMessage messageId={activityId} />
                <ActivityListItem messageId={activityId} />
                {i !== activityIds.length - 1 && <hr className="my-8" />}
              </motion.li>
            ),
        )}
      </ul>
      
      {/* 研究进行中显示加载动画 */}
      {ongoing && <LoadingAnimation className="mx-4 my-12" />}
    </>
  );
}

/**
 * 活动消息组件
 * 
 * 显示活动相关的文本消息内容
 * 过滤掉reporter和planner角色的消息
 * 
 * @param {object} props - 组件属性
 * @param {string} props.messageId - 消息ID
 * @returns {JSX.Element|null} 活动消息组件或null
 */
function ActivityMessage({ messageId }: { messageId: string }) {
  const message = useMessage(messageId);
  if (message?.agent && message.content) {
    if (message.agent !== "reporter" && message.agent !== "planner") {
      return (
        <div className="px-4 py-2">
          <Markdown animate>{message.content}</Markdown>
        </div>
      );
    }
  }
  return null;
}

/**
 * 活动列表项组件
 * 
 * 根据消息中的工具调用类型渲染不同的子组件
 * 支持网络搜索、网页爬取、Python代码执行和通用MCP工具
 * 
 * @param {object} props - 组件属性
 * @param {string} props.messageId - 消息ID
 * @returns {JSX.Element|null} 对应类型的工具调用组件或null
 */
function ActivityListItem({ messageId }: { messageId: string }) {
  const message = useMessage(messageId);
  if (message) {
    if (!message.isStreaming && message.toolCalls?.length) {
      for (const toolCall of message.toolCalls) {
        if (toolCall.name === "web_search") {
          return <WebSearchToolCall key={toolCall.id} toolCall={toolCall} />;
        } else if (toolCall.name === "crawl_tool") {
          return <CrawlToolCall key={toolCall.id} toolCall={toolCall} />;
        } else if (toolCall.name === "python_repl_tool") {
          return <PythonToolCall key={toolCall.id} toolCall={toolCall} />;
        } else {
          return <MCPToolCall key={toolCall.id} toolCall={toolCall} />;
        }
      }
    }
  }
  return null;
}

// 页面缓存，用于存储已访问页面的标题
const __pageCache = new LRUCache<string, string>({ max: 100 });

/**
 * 搜索结果类型定义
 * 
 * 页面类型：包含标题、URL和内容
 * 图片类型：包含图片URL和描述
 */
type SearchResult =
  | {
      type: "page";
      title: string;
      url: string;
      content: string;
    }
  | {
      type: "image";
      image_url: string;
      image_description: string;
    };

/**
 * 网络搜索工具调用组件
 * 
 * 显示网络搜索的结果，包括网页和图片结果
 * 支持加载状态和动画效果
 * 
 * @param {object} props - 组件属性
 * @param {ToolCallRuntime} props.toolCall - 工具调用运行时对象
 * @returns {JSX.Element} 搜索结果显示组件
 */
function WebSearchToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  // 检查是否正在搜索中
  const searching = useMemo(() => {
    return toolCall.result === undefined;
  }, [toolCall.result]);
  
  // 解析搜索结果JSON
  const searchResults = useMemo<SearchResult[]>(() => {
    let results: SearchResult[] | undefined = undefined;
    try {
      results = toolCall.result ? parseJSON(toolCall.result, []) : undefined;
    } catch {
      results = undefined;
    }
    if (Array.isArray(results)) {
      // 将页面标题存入缓存
      results.forEach((result) => {
        if (result.type === "page") {
          __pageCache.set(result.url, result.title);
        }
      });
    } else {
      results = [];
    }
    return results;
  }, [toolCall.result]);
  
  // 分离页面和图片结果
  const pageResults = useMemo(
    () => searchResults?.filter((result) => result.type === "page"),
    [searchResults],
  );
  const imageResults = useMemo(
    () => searchResults?.filter((result) => result.type === "image"),
    [searchResults],
  );
  
  return (
    <section className="mt-4 pl-4">
      {/* 搜索查询显示 */}
      <div className="font-medium italic">
        <RainbowText
          className="flex items-center"
          animated={searchResults === undefined}
        >
          <Search size={16} className={"mr-2"} />
          <span>Searching for&nbsp;</span>
          <span className="max-w-[500px] overflow-hidden text-ellipsis whitespace-nowrap">
            {(toolCall.args as { query: string }).query}
          </span>
        </RainbowText>
      </div>
      
      {/* 搜索结果区域 */}
      <div className="pr-4">
        {pageResults && (
          <ul className="mt-2 flex flex-wrap gap-4">
            {/* 加载中显示骨架屏 */}
            {searching &&
              [...Array(6)].map((_, i) => (
                <li
                  key={`search-result-${i}`}
                  className="flex h-40 w-40 gap-2 rounded-md text-sm"
                >
                  <Skeleton
                    className="to-accent h-full w-full rounded-md bg-gradient-to-tl from-slate-400"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </li>
              ))}
              
            {/* 网页结果列表 */}
            {pageResults
              .filter((result) => result.type === "page")
              .map((searchResult, i) => (
                <motion.li
                  key={`search-result-${i}`}
                  className="text-muted-foreground bg-accent flex max-w-40 gap-2 rounded-md px-2 py-1 text-sm"
                  initial={{ opacity: 0, y: 10, scale: 0.66 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <FavIcon
                    className="mt-1"
                    url={searchResult.url}
                    title={searchResult.title}
                  />
                  <a href={searchResult.url} target="_blank">
                    {searchResult.title}
                  </a>
                </motion.li>
              ))}
              
            {/* 图片结果列表 */}
            {imageResults.map((searchResult, i) => (
              <motion.li
                key={`search-result-${i}`}
                initial={{ opacity: 0, y: 10, scale: 0.66 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                <a
                  className="flex flex-col gap-2 overflow-hidden rounded-md opacity-75 transition-opacity duration-300 hover:opacity-100"
                  href={searchResult.image_url}
                  target="_blank"
                >
                  <Image
                    src={searchResult.image_url}
                    alt={searchResult.image_description}
                    className="bg-accent h-40 w-40 max-w-full rounded-md bg-cover bg-center bg-no-repeat"
                    imageClassName="hover:scale-110"
                    imageTransition
                  />
                </a>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/**
 * 网页爬取工具调用组件
 * 
 * 显示爬取的网页信息，包括URL和网站图标
 * 使用页面缓存获取页面标题
 * 
 * @param {object} props - 组件属性
 * @param {ToolCallRuntime} props.toolCall - 工具调用运行时对象
 * @returns {JSX.Element} 网页爬取结果组件
 */
function CrawlToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  // 获取爬取的URL
  const url = useMemo(
    () => (toolCall.args as { url: string }).url,
    [toolCall.args],
  );
  
  // 从缓存中获取页面标题
  const title = useMemo(() => __pageCache.get(url), [url]);
  
  return (
    <section className="mt-4 pl-4">
      <div>
        <RainbowText
          className="flex items-center text-base font-medium italic"
          animated={toolCall.result === undefined}
        >
          <BookOpenText size={16} className={"mr-2"} />
          <span>Reading</span>
        </RainbowText>
      </div>
      <ul className="mt-2 flex flex-wrap gap-4">
        <motion.li
          className="text-muted-foreground bg-accent flex h-40 w-40 gap-2 rounded-md px-2 py-1 text-sm"
          initial={{ opacity: 0, y: 10, scale: 0.66 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <FavIcon className="mt-1" url={url} title={title} />
          <a
            className="h-full flex-grow overflow-hidden text-ellipsis whitespace-nowrap"
            href={url}
            target="_blank"
          >
            {title ?? url}
          </a>
        </motion.li>
      </ul>
    </section>
  );
}

/**
 * Python代码执行工具调用组件
 * 
 * 显示执行的Python代码及其结果
 * 支持代码语法高亮，会根据主题自动切换样式
 * 
 * @param {object} props - 组件属性
 * @param {ToolCallRuntime} props.toolCall - 工具调用运行时对象
 * @returns {JSX.Element} Python代码执行组件
 */
function PythonToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  // 获取Python代码内容
  const code = useMemo<string>(() => {
    return (toolCall.args as { code: string }).code;
  }, [toolCall.args]);
  
  // 根据当前主题选择语法高亮样式
  const { resolvedTheme } = useTheme();
  
  return (
    <section className="mt-4 pl-4">
      <div className="flex items-center">
        <PythonOutlined className={"mr-2"} />
        <RainbowText
          className="text-base font-medium italic"
          animated={toolCall.result === undefined}
        >
          Running Python code
        </RainbowText>
      </div>
      <div>
        <div className="bg-accent mt-2 max-h-[400px] max-w-[calc(100%-120px)] overflow-y-auto rounded-md p-2 text-sm">
          <SyntaxHighlighter
            language="python"
            style={resolvedTheme === "dark" ? dark : docco}
            customStyle={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}

/**
 * 通用MCP工具调用组件
 * 
 * 显示各种MCP工具的调用信息
 * 支持折叠/展开结果，包含工具描述提示
 * 
 * @param {object} props - 组件属性
 * @param {ToolCallRuntime} props.toolCall - 工具调用运行时对象
 * @returns {JSX.Element} MCP工具调用组件
 */
function MCPToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  // 查找工具定义信息
  const tool = useMemo(() => findMCPTool(toolCall.name), [toolCall.name]);
  
  // 根据当前主题选择语法高亮样式
  const { resolvedTheme } = useTheme();
  
  return (
    <section className="mt-4 pl-4">
      <div className="w-fit overflow-y-auto rounded-md py-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Tooltip title={tool?.description}>
                <div className="flex items-center font-medium italic">
                  <PencilRuler size={16} className={"mr-2"} />
                  <RainbowText
                    className="pr-0.5 text-base font-medium italic"
                    animated={toolCall.result === undefined}
                  >
                    Running {toolCall.name ? toolCall.name + "()" : "MCP tool"}
                  </RainbowText>
                </div>
              </Tooltip>
            </AccordionTrigger>
            <AccordionContent>
              {toolCall.result && (
                <div className="bg-accent max-h-[400px] max-w-[560px] overflow-y-auto rounded-md text-sm">
                  <SyntaxHighlighter
                    language="json"
                    style={resolvedTheme === "dark" ? dark : docco}
                    customStyle={{
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    {toolCall.result.trim()}
                  </SyntaxHighlighter>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
