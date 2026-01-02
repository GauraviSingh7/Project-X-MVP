import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
