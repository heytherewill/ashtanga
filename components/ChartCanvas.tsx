import React from "react";
import Chart, {
  ChartConfiguration,
  ChartType,
  DefaultDataPoint,
} from "chart.js/auto";

interface ChartCanvasProps<TType extends ChartType, TData, TLabel>
  extends ChartConfiguration<TType, TData, TLabel> {}

export function ChartCanvas<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
>(props: ChartCanvasProps<TType, TData, TLabel>) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const chartRef = React.useRef<Chart<TType, TData, TLabel> | null>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvas, { ...props });
  }, [props]);
  return <canvas ref={ref} />;
}
