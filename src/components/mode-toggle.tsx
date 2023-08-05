'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type ModeToggleProps = {
  className?: string;
};

export function ModeToggle({ className }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const onClick = () => {
    if (theme === 'light') setTheme('dark');
    else setTheme('light');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button className={cn(className)} variant="outline" size="icon" onClick={onClick} suppressHydrationWarning>
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button className={cn(className)} variant="outline" size="icon" onClick={onClick} suppressHydrationWarning>
      {theme === 'light' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
