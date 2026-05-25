interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

import "../styles/Tooltip.css";

function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="tooltip">
      {children}
      <span className="tooltip__text">{text}</span>
    </div>
  );
}

export default Tooltip;
