

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-500/20 dark:border-violet-500/30 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-violet-500/10 dark:bg-violet-500/20 rounded-lg border border-violet-500/20 group-hover:bg-violet-500/20 dark:group-hover:bg-violet-500/30 transition-all-smooth">
              <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-xl font-bold text-foreground">
              <span className="text-violet-600 dark:text-violet-400">AIresume</span>
            </span>
          </Link>
          
          <nav className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-500/20 transition-all-smooth">
                <FileText className="h-4 w-4 mr-2" />
                Evaluar
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
