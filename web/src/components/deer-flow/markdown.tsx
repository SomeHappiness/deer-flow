// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { Check, Copy } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import ReactMarkdown, {
  type Options as ReactMarkdownOptions,
} from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

import { Button } from "~/components/ui/button";
import { rehypeSplitWordsIntoSpans } from "~/core/rehype";
import { autoFixMarkdown } from "~/core/utils/markdown";
import { cn } from "~/lib/utils";

import Image from "./image";
import { Tooltip } from "./tooltip";

/**
 * Markdown渲染组件
 * 
 * 用于渲染Markdown格式的文本内容
 * 支持GFM(GitHub Flavored Markdown)和数学公式
 * 可选择性地启用复制功能和动画效果
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @param {string|null} props.children - Markdown格式的文本内容
 * @param {React.CSSProperties} [props.style] - 内联样式对象
 * @param {boolean} [props.enableCopy=false] - 是否启用复制功能
 * @param {boolean} [props.animate=false] - 是否启用动画效果
 * @returns {JSX.Element} Markdown渲染组件
 */
export function Markdown({
  className,
  children,
  style,
  enableCopy,
  animated = false,
  ...props
}: ReactMarkdownOptions & {
  className?: string;
  enableCopy?: boolean;
  style?: React.CSSProperties;
  animated?: boolean;
}) {
  // 组件挂载状态的ref
  const isMountedRef = useRef(true);
  
  // 在组件卸载时设置为false
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // 使用静态数组避免无限渲染循环
  const rehypePluginsWithAnimate = useMemo(() => {
    try {
      return [rehypeKatex, rehypeSplitWordsIntoSpans];
    } catch (error) {
      console.error("Error creating rehype plugins with animation:", error);
      return [rehypeKatex];
    }
  }, []);
  
  const rehypePluginsWithoutAnimate = useMemo(() => [rehypeKatex], []);
  
  const currentRehypePlugins = animated ? rehypePluginsWithAnimate : rehypePluginsWithoutAnimate;
  
  // 提前处理Markdown内容，避免重复计算
  const processedContent = useMemo(() => {
    if (!children) return "";
    try {
      return autoFixMarkdown(
        dropMarkdownQuote(processKatexInMarkdown(children) ?? "") ?? ""
      );
    } catch (error) {
      console.error("Error processing markdown content:", error);
      return typeof children === 'string' ? children : "";
    }
  }, [children]);
  
  if (!processedContent && !children) {
    return null;
  }
  
  return (
    <div
      className={cn(
        className,
        "prose dark:prose-invert prose-p:my-0 prose-img:mt-0 flex flex-col gap-4",
      )}
      style={style}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={currentRehypePlugins}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <a href={src as string} target="_blank" rel="noopener noreferrer">
              <Image className="rounded" src={src as string} alt={alt ?? ""} />
            </a>
          ),
        }}
        {...props}
      >
        {processedContent}
      </ReactMarkdown>
      {enableCopy && typeof children === "string" && (
        <div className="flex">
          <CopyButton content={children} />
        </div>
      )}
    </div>
  );
}

/**
 * 复制按钮组件
 * 
 * 用于提供一键复制Markdown内容的功能
 * 点击后会显示复制成功的视觉反馈
 * 
 * @param {object} props - 组件属性
 * @param {string} props.content - 要复制的文本内容
 * @returns {JSX.Element} 复制按钮组件
 */
function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  // 组件挂载状态的ref
  const isMountedRef = useRef(true);
  
  // 在组件卸载时设置为false
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return (
    <Tooltip title="Copy">
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(content);
            if (isMountedRef.current) {
              setCopied(true);
              setTimeout(() => {
                if (isMountedRef.current) {
                  setCopied(false);
                }
              }, 1000);
            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}{" "}
      </Button>
    </Tooltip>
  );
}

/**
 * 处理Markdown中的KaTeX数学公式
 * 
 * 将各种KaTeX语法转换为标准格式以便正确渲染
 * 
 * @param {string|null|undefined} markdown - 输入的Markdown文本
 * @returns {string|null|undefined} 处理后的Markdown文本
 */
function processKatexInMarkdown(markdown?: string | null) {
  if (!markdown) return markdown;

  const markdownWithKatexSyntax = markdown
    .replace(/\\\\\[/g, "$$$$") // Replace '\\[' with '$$'
    .replace(/\\\\\]/g, "$$$$") // Replace '\\]' with '$$'
    .replace(/\\\\\(/g, "$$$$") // Replace '\\(' with '$$'
    .replace(/\\\\\)/g, "$$$$") // Replace '\\)' with '$$'
    .replace(/\\\[/g, "$$$$") // Replace '\[' with '$$'
    .replace(/\\\]/g, "$$$$") // Replace '\]' with '$$'
    .replace(/\\\(/g, "$$$$") // Replace '\(' with '$$'
    .replace(/\\\)/g, "$$$$"); // Replace '\)' with '$$';
  return markdownWithKatexSyntax;
}

/**
 * 删除Markdown中的代码块标记
 * 
 * 移除不必要的代码块标记，保留代码内容
 * 
 * @param {string|null|undefined} markdown - 输入的Markdown文本
 * @returns {string|null|undefined} 处理后的Markdown文本
 */
function dropMarkdownQuote(markdown?: string | null) {
  if (!markdown) return markdown;
  return markdown
    .replace(/^```markdown\n/gm, "")
    .replace(/^```text\n/gm, "")
    .replace(/^```\n/gm, "")
    .replace(/\n```$/gm, "");
}
