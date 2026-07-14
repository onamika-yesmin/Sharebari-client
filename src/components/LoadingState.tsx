import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="loading-mark" aria-hidden="true">
          <span className="loading-ring">
            <LoaderCircle size={34} />
          </span>
          <span className="loading-pulse loading-pulse-one" />
          <span className="loading-pulse loading-pulse-two" />
        </div>
        <div className="loading-copy">
          <strong>{label}</strong>
          <span className="loading-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="loading-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
