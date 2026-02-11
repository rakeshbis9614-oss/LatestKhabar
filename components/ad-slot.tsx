export function AdSlot({
  slot,
  className = "",
  size = "leaderboard",
}: {
  slot: string
  className?: string
  size?: "leaderboard" | "medium-rect" | "in-article"
}) {
  const sizeClasses = {
    leaderboard: "max-w-[728px] min-h-[90px]",
    "medium-rect": "max-w-[300px] min-h-[250px]",
    "in-article": "max-w-[336px] min-h-[250px] mx-auto",
  }

  return (
    <div className={`flex justify-center my-8 ${className}`} aria-label="विज्ञापन">
      <div
        className={`flex w-full items-center justify-center rounded-md border border-dashed bg-surface-secondary border-border ${sizeClasses[size]}`}
        data-ad-slot={slot}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">विज्ञापन</span>
      </div>
    </div>
  )
}
