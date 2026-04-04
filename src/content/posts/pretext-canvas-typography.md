---
title: 'Pretext：用 Canvas 实现极致排版'
date: 2026-04-04
excerpt: '探索如何使用 Cheng Lou 的 pretext 库在 Canvas 上实现精确的多行文本排版，支持所有语言和表情符号。'
tags: ['Typography', 'Canvas', 'JavaScript']
cover: '/covers/gallery/midnight-editor.svg'
author: 'Cheng Lou'
authorUrl: 'https://chenglou.me'
aiGenerated: true
aiModel: 'Claude Haiku 4.5'
---

## 什么是 Pretext？

Pretext 是由 Cheng Lou 开发的一个纯 JavaScript/TypeScript 库，用于进行多行文本的测量和排版。
它的设计目标是提供快速、准确的文本排版能力，支持所有语言（包括中文、阿拉伯文等复杂脚本）和表情符号，
同时避免触发浏览器的布局重排（reflow），这是网页性能优化的关键。

在传统的 Web 开发中，精确控制文本排版往往面临困境：DOM 的自动布局机制虽然方便，但在复杂交互场景中性能堪忧。
而 Canvas 虽然性能优异，但又缺乏文本测量的精确工具。Pretext 完美平衡了这两者，提供了一个高性能、高精度的文本排版引擎。

## 核心优势

- **高性能**：使用 Canvas 进行文本测量，避免 DOM 布局重排。文本测量的时间复杂度接近 O(1)
- **多语言支持**：完美支持中文、阿拉伯文、表情符号等复杂脚本，基于 Unicode 标准的精确处理
- **极致精准**：基于浏览器字体引擎的精确计算，像素级精度，支持所有字体和字重
- **灵活渲染**：支持 Canvas、DOM、SVG 等多种渲染方式，无需重新计算排版
- **零依赖**：纯 JavaScript 实现，没有外部依赖，文件极小

## API 概览

Pretext 提供两大类 API，分别面向不同的使用场景：

### 1. 测量类 API

用于计算文本在给定宽度和行高下的高度，无需触发 DOM 布局。这对于预计算内容高度、实现虚拟滚动等场景特别有用：

```javascript
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare('AGI 春天到了. بدأت الرحلة 🚀', '16px Inter')
const { height, lineCount } = layout(prepared, textWidth, 20)
// height: 总高度（像素）
// lineCount: 行数
```

这个 API 的优势在于零 DOM 副作用——它完全在内存中完成计算，不会触发浏览器的重排和重绘。

### 2. 排版类 API

用于获取每一行文本的详细信息，便于自定义渲染。如果你需要逐行处理文本（如 Canvas 绘制、自定义动画等），这个 API 是必需的：

```javascript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments('你好，世界', '24px sans-serif')
const { lines } = layoutWithLines(prepared, 500, 32)
// lines 是数组，每个元素包含：
// - text: 该行的完整文本
// - width: 该行的宽度（像素）
// - startIndex: 该行在原文本中的起始位置

lines.forEach((line, i) => {
  ctx.fillText(line.text, 0, i * 32)
})
```

## 在 Canvas 上的实现

在我们的极简博客中，使用了 Pretext 来在 Canvas 上实现精确的中文排版。
关键步骤包括：

1. 使用 `prepareWithSegments()` 预处理文本
2. 使用 `layoutWithLines()` 计算排版结果
3. 遍历返回的行数组，使用 Canvas API 逐行绘制

## 性能数据

根据官方基准测试，在 500 文本的批处理中：

- `prepare()` 耗时约 19ms
- `layout()` 耗时约 0.09ms（纯算术运算）

这意味着排版计算是极其高效的，完全可以用于实时交互场景。

## 实现案例：交互式排版

本博客中的 Pretext 实现展示了如何将文本排版与鼠标交互结合：

1. **预处理阶段**：使用 `prepareWithSegments()` 将文本分解为可测量的片段
2. **布局计算**：通过 `layoutWithLines()` 获得每行文本的精确宽度和位置
3. **DOM 渲染**：将排版结果转换为 DOM span 元素，保持文本可复制
4. **实时动画**：在 requestAnimationFrame 中根据鼠标位置实时计算每行的偏移量
5. **边界约束**：确保文本始终在容器范围内，避免布局溢出

这种方案既保留了 DOM 的可访问性和可选中特性，又能提供 Canvas 级别的渲染控制。

## 项目链接

Pretext 官方项目：[https://github.com/chenglou/pretext](https://github.com/chenglou/pretext)

## 总结

Pretext 是一个设计精妙、性能出色的文本排版库。
在构建需要精确控制文本渲染的应用时（如编辑器、设计工具、数据可视化等），
Pretext 都能提供堪称完美的解决方案。
