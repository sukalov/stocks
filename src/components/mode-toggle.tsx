"use client"
 
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { ThemeProvider, useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
 
export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const onClick = () => {
    if (theme === 'light') setTheme('dark')
    else setTheme('light')
  }
 
  return (
        <Button variant="outline" size="icon" onClick={onClick}>
            {theme !== 'light' 
            ? <Sun className="h-[1.2rem] w-[1.2rem]" />
            : <Moon className="h-[1.2rem] w-[1.2rem]" />
            }
          <span className="sr-only">Toggle theme</span>
        </Button>
  )
}