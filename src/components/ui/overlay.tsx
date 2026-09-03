"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ─── Tooltip ────────────────────────────────────────────────────────────

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const sideClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md",
            "animate-in fade-in zoom-in-95 duration-100",
            sideClasses[side],
            className
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}

// ─── Popover ────────────────────────────────────────────────────────────

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

function Popover({ trigger, children, align = "center", className }: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClasses: Record<string, string> = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            "absolute top-full z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg",
            "animate-in fade-in zoom-in-95 duration-200",
            alignClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Hover Card ─────────────────────────────────────────────────────────

interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function HoverCard({ trigger, children, className }: HoverCardProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 200);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      {isVisible && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 z-50 mb-2 w-80 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg",
            "animate-in fade-in zoom-in-95 duration-200",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Separator ──────────────────────────────────────────────────────────

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-gray-200",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

// ─── Divider ────────────────────────────────────────────────────────────

interface DividerProps {
  text?: string;
  className?: string;
}

function Divider({ text, className }: DividerProps) {
  if (!text) {
    return <Separator className={className} />;
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="flex-1 border-t border-gray-200" />
      <span className="px-4 text-sm text-gray-500">{text}</span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  );
}

export { Tooltip, Popover, HoverCard, Separator, Divider };
