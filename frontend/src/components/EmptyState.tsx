import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title = "No results found",
  message = "There's nothing to display at the moment.",
  icon
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <Inbox className="h-6 w-6 text-muted-foreground" />}
      </div>
      <p className="text-foreground font-medium mb-2">{title}</p>
      <p className="text-muted-foreground text-sm max-w-sm">{message}</p>
    </div>
  );
}
