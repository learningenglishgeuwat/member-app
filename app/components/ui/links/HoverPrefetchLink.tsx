'use client';

import type { AnchorHTMLAttributes, FocusEventHandler, MouseEventHandler, ReactNode } from 'react';
import NextLink, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

type HoverPrefetchLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children: ReactNode;
    prefetchOnHover?: boolean;
  };

function toPrefetchPath(href: HoverPrefetchLinkProps['href']): string | null {
  if (typeof href === 'string') return href;
  if (typeof href === 'object' && href !== null && 'pathname' in href && typeof href.pathname === 'string') {
    return href.pathname;
  }
  return null;
}

export default function HoverPrefetchLink({
  href,
  children,
  onMouseEnter,
  onFocus,
  prefetchOnHover = true,
  ...rest
}: HoverPrefetchLinkProps) {
  const router = useRouter();

  const prefetchTarget = () => {
    if (!prefetchOnHover) return;
    const path = toPrefetchPath(href);
    if (!path) return;
    router.prefetch(path);
  };

  const handleMouseEnter: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onMouseEnter?.(event);
    prefetchTarget();
  };

  const handleFocus: FocusEventHandler<HTMLAnchorElement> = (event) => {
    onFocus?.(event);
    prefetchTarget();
  };

  return (
    <NextLink
      {...rest}
      href={href}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      prefetch={false}
    >
      {children}
    </NextLink>
  );
}
