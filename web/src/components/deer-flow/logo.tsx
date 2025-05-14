// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import Link from "next/link";
import { cn } from "~/lib/utils";
import { RainbowText } from "~/components/deer-flow/rainbow-text";

/**
 * Logo组件
 * 
 * 用于在应用程序的各个部分显示应用程序的品牌标识
 * 点击标识可以导航回首页
 * 包含悬停效果，鼠标移上去时会提高不透明度
 * 
 * @returns React组件，显示带有链接的应用标识
 */
export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link
      className={cn("opacity-70 transition-opacity duration-300 hover:opacity-100 flex items-center", className)}
      href="/"
    >
      <span className="text-2xl md:text-3xl">🧠</span>
      {showText && (
        <RainbowText animated className="ml-2 text-2xl md:text-3xl font-bold">
          Nina
        </RainbowText>
      )}
    </Link>
  );
}
