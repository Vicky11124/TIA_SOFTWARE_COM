interface ProgressIndicatorProps {
  score: number;
}

const ProgressIndicator = ({ score }: ProgressIndicatorProps) => {
  let dots = "●○○○○";
  let label = "Understanding your project...";

  if (score >= 100) {
    dots = "●●●●●";
    label = "Quotation Ready!";
  } else if (score >= 75) {
    dots = "●●●●○";
    label = "Reviewing & Recommendations...";
  } else if (score >= 50) {
    dots = "●●●○○";
    label = "Budget & Timeline...";
  } else if (score >= 25) {
    dots = "●●○○○";
    label = "Planning features...";
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/30 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase select-none animate-fade-in">
      <span className="text-primary font-mono">{dots}</span>
      <span>{label}</span>
    </div>
  );
};

export default ProgressIndicator;
