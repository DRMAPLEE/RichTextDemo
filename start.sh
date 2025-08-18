#!/bin/bash

# ToastUI 富文本编辑器快速启动脚本

echo "🚀 ToastUI 富文本编辑器快速启动"
echo "=================================="

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

# 检查开发服务器是否已在运行
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🌐 开发服务器已在端口 5173 运行"
    echo "   主页: http://localhost:5173"
    echo "   演示: http://localhost:5173/demo"
elif lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🌐 开发服务器已在端口 5174 运行"
    echo "   主页: http://localhost:5174"
    echo "   演示: http://localhost:5174/demo"
elif lsof -Pi :5175 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🌐 开发服务器已在端口 5175 运行"
    echo "   主页: http://localhost:5175"
    echo "   演示: http://localhost:5175/demo"
else
    echo "🚀 启动开发服务器..."
    echo "   启动后请访问: http://localhost:5173 (或自动分配的端口)"
    echo "   演示页面: /demo"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    pnpm dev
fi
