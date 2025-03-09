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
}

export default function VirtualTable({
  columns,
  dataSource,
  rowHeight = 40,
  visibleRows = 20,
}: VirtualTableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);

  // 初始化Canvas尺寸
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const width = columns.reduce((sum, col) => sum + col.width, 0);
    const height = dataSource.length * rowHeight;

    canvas.width = width;
    canvas.height = height;
    setTotalWidth(width);
    setTotalHeight(height);

    // 初始绘制
    drawTable(ctx);
  }, [columns, dataSource, rowHeight]);

  // 绘制表格主体
  const drawTable = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, totalWidth, totalHeight);

      // 绘制列头
      ctx.fillStyle = "#f5f5f5";
      let x = 0;
      columns.forEach((col) => {
        ctx.fillRect(x, 0, col.width, rowHeight);
        ctx.strokeRect(x, 0, col.width, rowHeight);
        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.fillText(col.title, x + 10, rowHeight / 2 + 5);
        x += col.width;
      });

      // 绘制可见行
      const startRow = Math.floor(scrollTop / rowHeight);
      const endRow = startRow + visibleRows;

      dataSource.slice(startRow, endRow).forEach((row, index) => {
        const y = index * rowHeight - (scrollTop % rowHeight);

        let cellX = 0;
        columns.forEach((col) => {
          // 白色背景占位
          ctx.fillStyle = "#fff";
          ctx.fillRect(cellX, y, col.width, rowHeight);
          // 黑色边框
          ctx.fillStyle = "#666";
          ctx.strokeRect(cellX, y, col.width, rowHeight);
          // 文字内容
          ctx.fillText(row[col.dataIndex], cellX + 10, y + rowHeight / 2 + 5);
          cellX += col.width;
        });
      });
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

  // 处理滚动事件
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop } = e.currentTarget;
    setScrollLeft(scrollLeft);
    setScrollTop(scrollTop);
    requestAnimationFrame(() => {
      drawTable(canvasRef.current!.getContext("2d")!);
    });
  };

  return (
    <div className="virtual-table-container" onScroll={handleScroll}>
      <div
        className="canvas-wrapper"
        style={{
          width: totalWidth,
          height: totalHeight,
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
