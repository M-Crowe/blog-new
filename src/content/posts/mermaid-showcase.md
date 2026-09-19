---
title: 'Mermaid 图表渲染全景演示与测试'
date: 2026-09-18
excerpt: '全面验证博客对 Mermaid 流程图、时序图、类图、状态机、Git 图及数据可视化的渲染能力。'
tags: ['Mermaid', '可视化', '博客特性']
author: 'Marinus'
aiGenerated: true
aiModel: 'Gemini 3.7Flash'
---

本文用于测试与演示博客系统对 **Mermaid.js** 各种常用图表类型的渲染效果与交互特性。

## 1. 流程图 (Flowchart)

```mermaid
flowchart TD
    Start(["🚀 开始系统初始化"]) --> InitConfig["加载配置文件 config.yaml"]
    InitConfig --> CheckDB{"检查数据库连接"}

    CheckDB -- 成功 --> LoadCache["预热 Redis 缓存"]
    CheckDB -- 失败 --> RetryDB["重试连接 (最多3次)"]

    RetryDB --> CheckRetry{"重试是否超限?"}
    CheckRetry -- 未超限 --> CheckDB
    CheckRetry -- 已超限 --> SendAlert["🚨 发送告警通知"] --> Stop(["🛑 终止启动"])

    LoadCache --> StartServer["启动 HTTP/WebSocket 服务"]
    StartServer --> Ready(["✨ 系统就绪，开始监听流量"])
```

## 2. 时序图 (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as 用户 (浏览器)
    participant CDN as Cloudflare Pages
    participant Astro as Astro SSR/SSG
    participant DB as 数据存储

    User->>CDN: GET /posts/vcu_test
    CDN->>Astro: 命中边缘静态缓存
    alt 缓存命中 (Cache Hit)
        CDN-->>User: 200 OK (返回静态 HTML & Pretext 布局)
    else 缓存未命中 (Cache Miss)
        CDN->>Astro: 请求源站渲染
        Astro->>DB: 读取 Markdown 元数据
        DB-->>Astro: 返回文章与配置
        Astro-->>CDN: 生成静态页面并更新缓存
        CDN-->>User: 200 OK (首屏加载)
    end
    Note over User,CDN: 客户端异步加载 Mermaid 引擎完成图表渲染
```

## 3. 状态图 (State Diagram)

```mermaid
stateDiagram-v2
    [*] --> Standby: 上电自检正常
    Standby --> Precharge: 钥匙打至 ON & 踩下刹车
    Precharge --> Ready: BMS 高压就绪反馈
    Precharge --> Fault: 预充超时 (>50ms)
    Ready --> Postcharge: 钥匙关闭 (OFF)
    Postcharge --> Off: BMS 高压断开 & 泄放完成
    Off --> [*]

    Standby --> Fault: 高压互锁故障 (HVIL)
    Ready --> Fault: 高压互锁故障 (HVIL)
    Fault --> Off: 钥匙关闭 (OFF)
```

## 4. 类图 (Class Diagram)

```mermaid
classDiagram
    class VehicleController {
        +int vcuState
        +bool hvRequest
        +bool torqueEnable
        +handleKeyStatus(keySts: int)
        +processBrakeInput(pedal: float)
        +triggerFault(code: int)
    }

    class BatteryManagementSystem {
        +bool bmsHvReady
        +float voltage
        +float current
        +requestContactorClose()
        +requestContactorOpen()
    }

    class MotorInverter {
        +bool enabled
        +float targetTorque
        +setTorque(value: float)
        +emergencyShutdown()
    }

    VehicleController o-- BatteryManagementSystem : CAN 通信交互
    VehicleController --> MotorInverter : 发送扭矩使能
```

## 5. Git 分支图 (Git Graph)

```mermaid
gitGraph
    commit id: "feat: init"
    branch develop
    checkout develop
    commit id: "feat: BaseLayout"
    branch feature/mermaid
    checkout feature/mermaid
    commit id: "feat: add mermaid renderer"
    commit id: "style: nord theme integration"
    checkout develop
    merge feature/mermaid id: "merge: mermaid support"
    checkout main
    merge develop id: "release: v1.2.0" tag: "v1.2.0"
```

## 6. 饼图数据分析 (Pie Chart)

```mermaid
pie title 博客内容技术栈分布
    "Astro & TypeScript" : 45
    "Simulink & VCU 策略" : 25
    "Mermaid & 可视化" : 15
    "Pretext 字体渲染" : 15
```
