// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

/**
 * 区块标题组件
 * 
 * 用于显示各个区块的标题和描述
 * 支持锚点定位和渐变文字效果
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.anchor] - 锚点ID，用于页面内导航
 * @param {React.ReactNode} props.title - 标题内容
 * @param {React.ReactNode} props.description - 描述内容
 * @returns {JSX.Element} 区块标题组件
 */
export function SectionHeader({
  anchor,
  title,
  description,
}: {
  anchor?: string;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <>
      {/* 锚点定位元素 */}
      {anchor && <a id={anchor} className="absolute -top-20" />}
      
      {/* 标题和描述容器 */}
      <div className="mb-12 flex flex-col items-center justify-center gap-2">
        {/* 渐变文字标题 */}
        <h2 className="mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-center text-5xl font-bold text-transparent">
          {title}
        </h2>
        {/* 描述文本 */}
        <p className="text-muted-foreground text-center text-xl">
          {description}
        </p>
      </div>
    </>
  );
}
