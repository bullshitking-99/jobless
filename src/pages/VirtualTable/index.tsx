import { useRef, useEffect, useState, useCallback } from "react";
import "./index.scss";

interface ColumnConfig {
  width: number;
  title: string;
  dataIndex: string;
}

interface VirtualTableProps {
  columns: ColumnConfig[];
  dataSource: any[];
  rowHeight?: number;
  visibleRows?: number;
  width?: number;
  height?: number;
}

export default function VirtualTable({
  columns,
  dataSource,
  rowHeight = 40,
  visibleRows = 20,
  width,
  height,
}: VirtualTableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);

  // 初始化Canvas尺寸
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const _width = columns.reduce((sum, col) => sum + col.width, 0);
    const _height = dataSource.length * rowHeight;

    canvas.width = width || _width;
    canvas.height = height || _height;
    setTotalWidth(_width);
    setTotalHeight(_height);

    // 初始绘制
    drawTable(ctx);

    // 清空Canvas
    return () => {
      canvas.width = width || _width;
      canvas.height = height || _height;
    };
  }, [columns, dataSource, rowHeight]);

  // 绘制表头
  const drawHeader = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      let x = 0;
      columns.forEach((col) => {
        // 绘制表头背景
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(x, 0, col.width, rowHeight);
        ctx.strokeRect(x, 0, col.width, rowHeight);

        // 绘制表头文字
        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.fillText(col.title, x + 10, rowHeight / 2 + 5);

        x += col.width;
      });
    },
    [columns, rowHeight]
  );

  // 绘制表格主体
  const drawTable = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, rowHeight, totalWidth, totalHeight);

      // 绘制可见行
      const startRow = Math.floor(scrollTop / rowHeight);
      const endRow = startRow + visibleRows;

      dataSource.slice(startRow, endRow).forEach((row, index) => {
        const y = (index + 1) * rowHeight - (scrollTop % rowHeight);

        let cellX = 0;
        columns.forEach((col) => {
          // 白色背景占位
          ctx.fillStyle = "#fff";
          ctx.fillRect(cellX, y, col.width, rowHeight);
          // 黑色边框
          ctx.fillStyle = "#666";
          ctx.strokeRect(cellX, y, col.width, rowHeight);
          // 文字内容
          ctx.font = "14px Arial";
          ctx.fillText(row[col.dataIndex], cellX + 10, y + rowHeight / 2 + 5);
          cellX += col.width;
        });
      });

      // 重新绘制表头以确保其始终显示在最上层
      drawHeader(ctx);
    },
    [
      scrollTop,
      columns,
      dataSource,
      rowHeight,
      visibleRows,
      totalWidth,
      totalHeight,
    ]
  );

  // 处理鼠标滚轮事件
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const newScrollTop = Math.max(
        0,
        Math.min(scrollTop + e.deltaY, totalHeight - rowHeight * visibleRows)
      );
      setScrollTop(newScrollTop);
      requestAnimationFrame(() => {
        drawTable(canvasRef.current!.getContext("2d")!);
      });
    },
    [scrollTop, totalHeight, rowHeight, visibleRows, drawTable]
  );

  // 添加和移除wheel事件监听
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel);
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  return <canvas ref={canvasRef} />;
}
