import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface VaCardProps {
  children: ReactNode
  className?: string
  glass?: boolean
  hover?: boolean
  onClick?: () => void
  padding?: 'sm' | 'md' | 'lg' | 'none'
  animate?: boolean
}

export default function VaCard({ children, className, glass, hover, onClick, padding = 'md', animate = true }: VaCardProps) {
  const padMap = { sm: 'p-4', md: 'p-5', lg: 'p-6', none: '' }
  const base = clsx(
    'rounded-va border transition-all duration-200',
    padMap[padding],
    glass ? 'bg-white/80 backdrop-blur-sm border-white/60 shadow-va-glass' : 'bg-white border-va-gray-light shadow-va-card',
    hover && 'hover:shadow-va-hover hover:-translate-y-0.5 cursor-pointer',
    className
  )
  const Comp = animate ? motion.div : 'div'
  const animProps = animate ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } } : {}
  return <Comp className={base} onClick={onClick} {...animProps}>{children}</Comp>
}
