# Blog Cover App

一个基于 **Vite + React + TypeScript** 的博客头图生成器。

## 功能

- 根据文章标题生成博客头图
- 四种风格：科技风 / 文艺风 / 商务风 / 自然风
- 基于 `title + style + variant` 的可复现 seed
- 一键下载 PNG
- 本地历史记录回放
- 基于关键词的风格推荐

## 开发

```bash
npm install
npm run dev
```

## 校验

```bash
npm run lint
npm run test
npm run build
```

## 目录结构

```text
src/
  components/         React 组件
  lib/cover/          Canvas 渲染引擎、seed、布局、风格实现
  lib/recommendation/ 风格推荐
  lib/storage/        历史记录
  test/               测试初始化
```

## 设计说明

- 旧目录根部的 `index.html` / `fixed-version.html` 仅保留作历史参考。
- 新项目代码位于 `blog-cover-app/`。
- 生成结果默认可复现；点击“换一版”会改变 variant，从而得到稳定的新版本。
