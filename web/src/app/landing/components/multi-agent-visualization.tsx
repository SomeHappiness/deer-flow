// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import {
  Play,
  type LucideIcon,
  ChevronRight,
  ChevronLeft,
  Pause,
  Fullscreen,
  Minimize,
} from "lucide-react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef, useState } from "react";

import { Tooltip } from "~/components/deer-flow/tooltip";
import { ShineBorder } from "~/components/magicui/shine-border";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { useIntersectionObserver } from "~/hooks/use-intersection-observer";
import { cn } from "~/lib/utils";

import { playbook, type GraphNode } from "../store";
import {
  activateStep,
  nextStep,
  play,
  prevStep,
  togglePlay,
  useMAVStore,
} from "../store/mav-store";

const nodeTypes = {
  circle: CircleNode,
  agent: AgentNode,
  default: AgentNode,
};

/**
 * 多智能体可视化组件
 * 
 * 展示多智能体协作流程的可视化动画，支持自动播放、手动控制、全屏切换等功能。
 * 使用ReactFlow实现节点和边的渲染。
 * 
 * @param {object} props - 组件属性
 * @param {string} [props.className] - 自定义CSS类名
 * @returns {JSX.Element} 多智能体可视化组件
 */
export function MultiAgentVisualization({ className }: { className?: string }) {
  const {
    graph: { nodes, edges },
    activeStepIndex,
    playing,
  } = useMAVStore((state) => state);
  const flowRef = useRef<ReactFlowInstance<GraphNode, Edge>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { ref: anchorRef } = useIntersectionObserver({
    rootMargin: "0%",
    threshold: 0,
    onChange: (isIntersecting) => {
      if (isIntersecting && !playing && !hasPlayed) {
        setHasPlayed(true);
        void play();
      }
    },
  });
  const toggleFullscreen = useCallback(async () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        setFullscreen(true);
        await containerRef.current.requestFullscreen();
        setTimeout(() => {
          void flowRef.current?.fitView({ maxZoom: 2.5 });
        }, 100);
      } else {
        setFullscreen(false);
        await document.exitFullscreen();
        setTimeout(() => {
          void flowRef.current?.fitView();
        }, 100);
      }
    }
  }, []);
  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full flex-col pb-4", className)}
    >
      {/* ReactFlow流程图区域 */}
      <ReactFlow
        className={cn("flex min-h-0 flex-grow")}
        style={{
          ["--xy-background-color-default" as string]: "transparent",
        }}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        panOnScroll={false}
        zoomOnScroll={false}
        preventScrolling={false}
        panOnDrag={false}
        onInit={(instance) => {
          flowRef.current = instance;
        }}
      >
        {/* 背景渐变遮罩 */}
        <Background
          className="[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          bgColor="var(--background)"
        />
        {/* 用于自动触发动画的锚点 */}
        <div
          ref={anchorRef}
          id="auto-run-animation-trigger"
          className="absolute bottom-0 left-[50%] h-px w-px"
        />
      </ReactFlow>
      <div className="h-4 shrink-0"></div>
      {/* 控制面板区域 */}
      <div className="flex h-6 w-full shrink-0 items-center justify-center">
        <div className="bg-muted/50 z-[200] flex rounded-3xl px-4 py-2">
          {/* 上一步按钮 */}
          <Tooltip title="Move to the previous step">
            <Button variant="ghost" onClick={prevStep}>
              <ChevronLeft className="size-5" />
            </Button>
          </Tooltip>
          {/* 播放/暂停按钮 */}
          <Tooltip title="Play / Pause">
            <Button variant="ghost" onClick={togglePlay}>
              {playing ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
            </Button>
          </Tooltip>
          {/* 下一步按钮 */}
          <Tooltip title="Move to the next step">
            <Button
              variant="ghost"
              onClick={() => {
                setHasPlayed(true);
                nextStep();
              }}
            >
              <ChevronRight className="size-5" />
            </Button>
          </Tooltip>
          {/* 步骤滑块 */}
          <div className="text-muted-foreground ml-2 flex items-center justify-center">
            <Slider
              className="w-120"
              max={playbook.steps.length - 1}
              min={0}
              step={1}
              value={[activeStepIndex >= 0 ? activeStepIndex : 0]}
              onValueChange={([value]) => {
                setHasPlayed(true);
                activateStep(value!);
              }}
            />
          </div>
          {/* 全屏切换按钮 */}
          <Tooltip title="Toggle fullscreen">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setHasPlayed(true);
                void toggleFullscreen();
              }}
            >
              {fullscreen ? (
                <Minimize className="size-5" />
              ) : (
                <Fullscreen className="size-5" />
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

/**
 * 圆形节点组件
 * 
 * 用于流程图中的起始和结束节点，支持高亮显示
 * @param {object} data - 节点数据，包含label和active状态
 */
function CircleNode({ data }: { data: { label: string; active: boolean } }) {
  return (
    <>
      {/* 激活时显示高亮边框 */}
      {data.active && (
        <ShineBorder
          className="rounded-full"
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        />
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--xy-node-background-color-default)]">
        <p className="text-xs">{data.label}</p>
      </div>
      {/* 起始和结束节点的连接句柄 */}
      {data.label === "Start" && (
        <Handle
          className="invisible"
          type="source"
          position={Position.Right}
          id="right"
        />
      )}
      {data.label === "End" && (
        <Handle
          className="invisible"
          type="target"
          position={Position.Top}
          id="top"
        />
      )}
    </>
  );
}

/**
 * 智能体节点组件
 * 
 * 用于流程图中的智能体节点，支持高亮、图标、步骤描述等
 * @param {object} data - 节点数据，包含icon、label、active、stepDescription等
 * @param {string} id - 节点ID
 */
function AgentNode({
  data,
  id,
}: {
  data: {
    icon?: LucideIcon;
    label: string;
    active: boolean;
    stepDescription?: string;
    stepTooltipPosition?: "left" | "right" | "top" | "bottom";
  };
  id: string;
}) {
  return (
    <>
      {/* 激活时显示高亮边框 */}
      {data.active && (
        <ShineBorder
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          className="rounded-[2px]"
        />
      )}
      {/* 步骤描述气泡提示 */}
      <Tooltip
        className="max-w-50 text-[15px] font-light opacity-70"
        style={{
          ["--primary" as string]: "#333",
          ["--primary-foreground" as string]: "white",
        }}
        open={data.active && !!data.stepDescription}
        title={data.stepDescription}
        side={data.stepTooltipPosition}
        sideOffset={20}
      >
        <div
          id={id}
          className="relative flex w-full items-center justify-center text-xs"
        >
          <div className="flex items-center gap-2">
            {data.icon && <data.icon className="h-[1rem] w-[1rem]" />}
            <span>{data.label}</span>
          </div>
        </div>
      </Tooltip>
      {/* 多方向连接句柄 */}
      <Handle
        className="invisible"
        type="source"
        position={Position.Left}
        id="left"
      />
      <Handle
        className="invisible"
        type="source"
        position={Position.Right}
        id="right"
      />
      <Handle
        className="invisible"
        type="source"
        position={Position.Top}
        id="top"
      />
      <Handle
        className="invisible"
        type="source"
        position={Position.Bottom}
        id="bottom"
      />
      <Handle
        className="invisible"
        type="target"
        position={Position.Left}
        id="left"
      />
      <Handle
        className="invisible"
        type="target"
        position={Position.Right}
        id="right"
      />
      <Handle
        className="invisible"
        type="target"
        position={Position.Top}
        id="top"
      />
      <Handle
        className="invisible"
        type="target"
        position={Position.Bottom}
        id="bottom"
      />
    </>
  );
}
