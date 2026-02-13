#!/bin/bash

# ReliQ Facilitator Quick Start

echo "🚀 ReliQ x402 Facilitator"
echo "========================"

# Check .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "Please copy and edit .env.example:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Check node_modules
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    bun install
fi

echo ""
echo "Choose operation:"
echo "1. Start facilitator (dev mode)"
echo "2. Start facilitator (production)"
echo "3. Stop facilitator"
echo ""
read -p "Select (1-3): " choice

case $choice in
    1)
        echo "🚀 Starting facilitator (dev mode)..."
        bun run dev
        ;;
    2)
        echo "🚀 Starting facilitator (production)..."
        bun start
        ;;
    3)
        echo "🛑 Stopping facilitator..."
        pkill -f "bun.*facilitator" || echo "No running facilitator found"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
