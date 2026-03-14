interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  inline?: boolean;
}

export function Loader({
  size = "md",
  color = "border-orange-500",
  inline = false,
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  if (inline) {
    return (
      <div
        className={`animate-spin rounded-full border-b-2 ${color} ${sizeClasses[size]} flex-shrink-0`}
      ></div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full border-b-2 ${color} ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
