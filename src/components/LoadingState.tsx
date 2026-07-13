import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <LoaderCircle size={28} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
