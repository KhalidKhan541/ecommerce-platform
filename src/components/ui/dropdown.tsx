"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

// ─── Dropdown Context ───────────────────────────────────────────────────

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

// ─── Dropdown ───────────────────────────────────────────────────────────

interface DropdownProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Dropdown({ children, open: controlledOpen, onOpenChange }: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = (value: boolean) => {
    onOpenChange?.(value);
    setInternalOpen(value);
  };

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle: () => setIsOpen(!isOpen),
      }}
    >
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

// ─── Dropdown Trigger ───────────────────────────────────────────────────

interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function DropdownTrigger({ children, className, ...props }: DropdownTriggerProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownTrigger must be used within Dropdown");

  return (
    <button
      type="button"
      className={cn("inline-flex items-center justify-center", className)}
      onClick={context.toggle}
      aria-expanded={context.isOpen}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Dropdown Content ───────────────────────────────────────────────────

interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}

function DropdownContent({
  children,
  className,
  align = "center",
  side = "bottom",
  ...props
}: DropdownContentProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownContent must be used within Dropdown");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.setIsOpen(false);
      }
    }

    if (context.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [context.isOpen, context.setIsOpen]);

  if (!context.isOpen) return null;

  const alignClasses: Record<string, string> = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideClasses: Record<string, string> = {
    top: "bottom-full mb-2",
    side: "top-full mt-2",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg",
        "animate-in fade-in zoom-in-95 duration-200",
        alignClasses[align],
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Dropdown Item ──────────────────────────────────────────────────────

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  destructive?: boolean;
}

function DropdownItem({
  children,
  className,
  icon,
  destructive,
  onClick,
  ...props
}: DropdownItemProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownItem must be used within Dropdown");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context.setIsOpen(false);
  };

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-gray-100 focus:bg-gray-100",
        destructive
          ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
          : "text-gray-700",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {children}
    </button>
  );
}

// ─── Dropdown Separator ─────────────────────────────────────────────────

function DropdownSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("my-1 h-px bg-gray-200", className)} role="separator" />
  );
}

// ─── Dropdown Label ─────────────────────────────────────────────────────

function DropdownLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-gray-500",
        className
      )}
    >
      {children}
    </div>
  );
}

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};
