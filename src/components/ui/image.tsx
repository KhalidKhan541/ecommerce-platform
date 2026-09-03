"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Avatar ─────────────────────────────────────────────────────────────

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizes: Record<string, string> = {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    const initials = fallback || (alt ? alt.charAt(0).toUpperCase()) : "?";

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200",
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-gray-600">{initials}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

// ─── AvatarGroup ────────────────────────────────────────────────────────

interface AvatarGroupProps {
  avatars: { src?: string | null; alt?: string; fallback?: string }[];
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
}

function AvatarGroup({ avatars, max = 4, size = "md" }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizeClasses: Record<string, string> = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full bg-gray-300 ring-2 ring-white",
            sizeClasses[size]
          )}
        >
          <span className="font-medium text-gray-700">+{remaining}</span>
        </div>
      )}
    </div>
  );
}

// ─── Image with Fallback ────────────────────────────────────────────────

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackElement?: React.ReactNode;
}

function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/placeholder.png",
  fallbackElement,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  if (hasError) {
    if (fallbackElement) {
      return <div className={className}>{fallbackElement}</div>;
    }
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  return (
    <>
      {isLoading && (
        <div className={cn("animate-pulse bg-gray-200", className)} />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        style={isLoading ? { display: "none" } : undefined}
        {...props}
      />
    </>
  );
}

// ─── Thumbnail ──────────────────────────────────────────────────────────

interface ThumbnailProps {
  src: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

function Thumbnail({ src, alt, size = "md", className }: ThumbnailProps) {
  const sizes: Record<string, string> = {
    xs: "h-8 w-8",
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  };

  return (
    <div className={cn("overflow-hidden rounded-lg bg-gray-100", sizes[size], className)}>
      <img
        src={src}
        alt={alt || "Thumbnail"}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export { Avatar, AvatarGroup, ImageWithFallback, Thumbnail };
