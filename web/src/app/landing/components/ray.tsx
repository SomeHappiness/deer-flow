// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

/**
 * 射线光效背景组件
 *
 * 用于页面顶部的动态光斑背景装饰，提升视觉层次感。
 * 通过SVG椭圆和高斯模糊滤镜实现柔和的光晕效果。
 * 该组件通常绝对定位于页面顶层，不影响交互。
 *
 * @returns {JSX.Element} SVG光效背景
 */
export function Ray() {
  return (
    <svg
      className="animate-spotlight pointer-events-none fixed -top-80 left-0 z-[99] h-[169%] w-[138%] opacity-0 md:-top-20 md:left-60 lg:w-[84%]"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      {/* 主体光斑椭圆，带有透明度 */}
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill="white"
          fillOpacity="0.21"
        ></ellipse>
      </g>
      {/* SVG滤镜定义：高斯模糊实现柔光 */}
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          {/* 透明背景 */}
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          {/* 正常混合 */}
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          {/* 高斯模糊效果 */}
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
}
