// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { GithubFilled } from "@ant-design/icons";
import Link from "next/link";

import { AuroraText } from "~/components/magicui/aurora-text";
import { Button } from "~/components/ui/button";

import { SectionHeader } from "../components/section-header";

/**
 * 加入社区区块组件
 * 
 * 鼓励用户加入Nina社区，参与贡献和协作
 * @returns {JSX.Element} 加入社区区块
 */
export function JoinCommunitySection() {
  return (
    <section className="flex w-full flex-col items-center justify-center pb-12">
      {/* 区块标题，带渐变色AuroraText */}
      <SectionHeader
        anchor="join-community"
        title={
          <AuroraText colors={["#60A5FA", "#A5FA60", "#A560FA"]}>
            Join the Nina 
          </AuroraText>
        }
        description="make the world cooler!"
      />
      {/* GitHub贡献按钮
      <Button className="text-xl" size="lg" asChild>
        <Link href="https://github.com/bytedance/deer-flow" target="_blank">
          <GithubFilled />
          Contribute Now
        </Link>
      </Button> */}
    </section>
  );
}
