// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { GithubFilled } from "@ant-design/icons";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { AuroraText } from "~/components/magicui/aurora-text";
import { FlickeringGrid } from "~/components/magicui/flickering-grid";
import { Button } from "~/components/ui/button";
import { env } from "~/env";

/**
 * 首页大横幅（Jumbotron）组件
 *
 * 展示产品主标题、简介、动态背景和主要行动按钮。
 * 包含两层动态网格背景，主标题渐变文字，按钮根据环境跳转不同页面。
 *
 * @returns {JSX.Element} 首页大横幅区块
 */
export function Jumbotron() {
  return (
    <section className="flex h-[95vh] w-full flex-col items-center justify-center pb-15">
      {/* 第一层动态背景网格，带径向遮罩 */}
      <FlickeringGrid
        id="deer-hero-bg"
        className={`absolute inset-0 z-0 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]`}
        squareSize={4}
        gridGap={4}
        color="#60A5FA"
        maxOpacity={0.133}
        flickerChance={0.1}
      />
      {/* 第二层鹿形动态网格，SVG遮罩 */}
      <FlickeringGrid
        id="deer-hero"
        className="absolute inset-0 z-0 translate-y-[2vh] mask-[url(/images/deer-hero.svg)] mask-size-[100vw] mask-center mask-no-repeat md:mask-size-[72vh]"
        squareSize={3}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.64}
        flickerChance={0.12}
      />
      {/* 主要内容区 */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        {/* 主标题，渐变色+动态文字 */}
        <h1 className="text-center text-4xl font-bold md:text-6xl">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Deep Research{" "}
          </span>
          <AuroraText>at Your Fingertips</AuroraText>
        </h1>
        {/* 产品简介 */}
        <p className="max-w-4xl p-2 text-center text-sm opacity-85 md:text-2xl">
          Meet DeerFlow, your personal Deep Research assistant. With powerful
          tools like search engines, web crawlers, Python and MCP services, it
          delivers instant insights, comprehensive reports, and even captivating
          podcasts.
        </p>
        {/* 行动按钮区 */}
        <div className="flex gap-6">
          {/* 进入产品/开源主页按钮，环境变量控制跳转 */}
          <Button className="hidden text-lg md:flex md:w-42" size="lg" asChild>
            <Link
              target={
                env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY ? "_blank" : undefined
              }
              href={
                env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY
                  ? "https://github.com/bytedance/deer-flow"
                  : "/chat"
              }
            >
              Get Started <ChevronRight />
            </Link>
          </Button>
          {/* GitHub 了解更多按钮，仅在非静态模式下显示 */}
          {!env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && (
            <Button
              className="w-42 text-lg"
              size="lg"
              variant="outline"
              asChild
            >
              <Link
                href="https://github.com/bytedance/deer-flow"
                target="_blank"
              >
                <GithubFilled />
                Learn More
              </Link>
            </Button>
          )}
        </div>
      </div>
      {/* 底部英文释义说明 */}
      <div className="absolute bottom-8 flex text-xs opacity-50">
        <p>* DEER stands for Deep Exploration and Efficient Research.</p>
      </div>
    </section>
  );
}
