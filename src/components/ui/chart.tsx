import React from "react";

// ChartConfig type definition (customize as needed)
export interface ChartConfig {
  desktop: {
    label: string;
    color: string;
  };
  mobile: {
    label: string;
    color: string;
  };
  label: {
    color: string;
  };
}

// ChartContainer component
export const ChartContainer: React.FC<{
  config: ChartConfig;
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      className="chart-container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {children}
    </div>
  );
};

// ChartTooltip component
export const ChartTooltip: React.FC<{
  cursor?: boolean;
  content: React.ReactNode;
}> = ({ cursor = false, content }) => {
  return (
    <div className="chart-tooltip">
      {cursor && <div className="tooltip-cursor" />}
      {content}
    </div>
  );
};

// ChartTooltipContent component
export const ChartTooltipContent: React.FC<{ indicator?: string }> = ({
  indicator,
}) => {
  return (
    <div className="tooltip-content">
      <span>{indicator && `Indicator: ${indicator}`}</span>
    </div>
  );
};
