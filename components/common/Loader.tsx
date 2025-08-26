interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function Loader({
  size = "md",
  color = "border-orange-500",
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full border-b-2 ${color} ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
