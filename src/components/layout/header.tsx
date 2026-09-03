"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/card";
import { Avatar } from "@/components/ui/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";

// ─── Top Bar ────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs text-gray-500 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span>Free shipping on orders over $50</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">30-day returns</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/help" className="hover:text-gray-900">
            Help
          </Link>
          <Link href="/track-order" className="hover:text-gray-900">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Logo ───────────────────────────────────────────────────────────────

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white font-bold text-sm">
        S
      </div>
      <span className="text-xl font-bold text-gray-900">ShopHub</span>
    </Link>
  );
}

// ─── Main Navigation ────────────────────────────────────────────────────

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "New Arrivals", href: "/shop?sort=newest" },
  { name: "Sale", href: "/shop?sale=true" },
];

function MainNav() {
  return (
    <nav className="hidden lg:flex lg:items-center lg:gap-8">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

// ─── Search Bar ─────────────────────────────────────────────────────────

function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <form className="hidden md:block flex-1 max-w-lg mx-8" action="/shop" method="get">
      <div className="relative">
        <Input
          type="search"
          name="q"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          className="pl-10"
        />
      </div>
    </form>
  );
}

// ─── Header Actions ─────────────────────────────────────────────────────

function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="hidden sm:flex">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </Button>

      <Link href="/cart" className="relative">
        <Button variant="ghost" size="icon">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Button>
        <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
          3
        </Badge>
      </Link>

      <Dropdown>
        <DropdownTrigger>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Avatar size="sm" alt="User" />
            <span className="hidden lg:inline">Account</span>
          </div>
        </DropdownTrigger>
        <DropdownContent align="end">
          <DropdownItem>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Account
          </DropdownItem>
          <DropdownItem>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Orders
          </DropdownItem>
          <DropdownItem>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem destructive>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </DropdownItem>
        </DropdownContent>
      </Dropdown>

      <Button variant="ghost" size="icon" className="lg:hidden">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>
    </div>
  );
}

// ─── Mobile Menu ────────────────────────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <Logo />
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}
          <hr className="my-2" />
          <Link
            href="/auth/login"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Create Account
          </Link>
        </nav>
      </div>
    </div>
  );
}

// ─── Main Header ────────────────────────────────────────────────────────

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <TopBar />
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <MainNav />
          <SearchBar />
          <HeaderActions />
        </div>
      </div>
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}

export { Header, TopBar, Logo, MainNav, SearchBar, HeaderActions, MobileMenu };
