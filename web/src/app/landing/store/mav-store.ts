// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { create } from "zustand";

import { sleep } from "~/core/utils";

import { graph, type Graph } from "./graph";
import { playbook } from "./playbook";

/**
 * 多智能体可视化状态管理
 * 使用Zustand管理流程图状态、当前步骤和播放状态
 */
export const useMAVStore = create<{
  graph: Graph;
  activeStepIndex: number;
  playing: boolean;
}>(() => ({
  graph,
  activeStepIndex: -1,
  playing: false,
}));

/**
 * 激活指定步骤
 * 更新节点和边的状态，显示当前步骤的激活状态和描述
 * @param stepIndex 要激活的步骤索引
 */
export function activateStep(stepIndex: number) {
  const nextStep = playbook.steps[stepIndex]!;
  const currentGraph = useMAVStore.getState().graph;
  const nextGraph: Graph = {
    nodes: currentGraph.nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        active: nextStep.activeNodes.includes(node.id),
        stepDescription:
          nextStep.activeNodes.indexOf(node.id) ===
            nextStep.activeNodes.length - 1 && nextStep.description,
        stepTooltipPosition:
          nextStep.activeNodes.indexOf(node.id) ===
            nextStep.activeNodes.length - 1 && nextStep.tooltipPosition,
      },
    })),
    edges: currentGraph.edges.map((edge) => ({
      ...edge,
      animated: nextStep.activeEdges.includes(edge.id),
    })),
  };
  useMAVStore.setState({
    activeStepIndex: stepIndex,
    graph: nextGraph,
  });
}

/**
 * 切换到下一步
 * 如果已经是最后一步，则回到第一步
 */
export function nextStep() {
  let stepIndex = useMAVStore.getState().activeStepIndex;
  if (stepIndex >= playbook.steps.length - 1) {
    stepIndex = 0;
  } else {
    stepIndex++;
  }
  activateStep(stepIndex);
}

/**
 * 切换到上一步
 * 如果已经是第一步，则跳到最后一步
 */
export function prevStep() {
  let stepIndex = useMAVStore.getState().activeStepIndex;
  if (stepIndex <= 0) {
    stepIndex = playbook.steps.length - 1;
  } else {
    stepIndex--;
  }
  activateStep(stepIndex);
}

/**
 * 开始自动播放
 * 每3秒切换一次步骤，直到播放被暂停或到达最后一步
 */
export async function play() {
  const state = useMAVStore.getState();
  const activeStepIndex = state.activeStepIndex;
  if (activeStepIndex >= playbook.steps.length - 1) {
    if (state.playing) {
      stop();
      return;
    }
  }
  useMAVStore.setState({
    playing: true,
  });
  nextStep();
  await sleep(3000);
  const playing = useMAVStore.getState().playing;
  if (playing) {
    await play();
  }
}

/**
 * 暂停播放
 */
export function pause() {
  useMAVStore.setState({
    playing: false,
  });
}

/**
 * 切换播放/暂停状态
 */
export async function togglePlay() {
  const playing = useMAVStore.getState().playing;
  if (playing) {
    pause();
  } else {
    await play();
  }
}

/**
 * 停止播放并重置状态
 */
export function stop() {
  useMAVStore.setState({
    playing: false,
    activeStepIndex: -1,
    graph,
  });
}
