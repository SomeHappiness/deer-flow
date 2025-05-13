// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import Link from "next/link";

/**
 * Logo组件
 * 
 * 用于在应用程序的各个部分显示应用程序的品牌标识
 * 点击标识可以导航回首页
 * 包含悬停效果，鼠标移上去时会提高不透明度
 * 
 * @returns React组件，显示带有链接的应用标识
 */
export function Logo() {
  return (
    <Link
      className="opacity-70 transition-opacity duration-300 hover:opacity-100"
      href="/"
    >
      🧠 Nina
    </Link>
  );
}
