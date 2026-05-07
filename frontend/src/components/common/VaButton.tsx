import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline'
type Size    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface VaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:   'bg-va-blue text-white hover:bg-blue-500 shadow-va-glow-blue',
  secondary: 'bg-va-lavender text-va-blue hover:bg-blue-50 border border-va-blue/20',
  ghost:     'bg-transparent text-va-gray-text hover:bg-va-white-off hover:text-va-charcoal',
  danger:    'bg-va-emergency text-white hover:bg-red-500 shadow-va-emergency',
  success:   'bg-va-success text-white hover:bg-emerald-500 shadow-va-glow-green',
  outline:   'bg-transparent border border-va-gray-light text-va-charcoal hover:border-va-blue hover:text-va-blue',
}
const sizes: Record<Size, string> = {
  xs: 'px-2.5 py-1   text-xs  gap-1   rounded-lg',
  sm: 'px-3   py-1.5 text-sm  gap-1.5 rounded-[10px]',
  md: 'px-4   py-2   text-sm  gap-2   rounded-va',
  lg: 'px-5   py-2.5 text-base gap-2  rounded-va',
  xl: 'px-6   py-3   text-lg  gap-2.5 rounded-va-lg',
}

export default function VaButton({
  variant = 'primary', size = 'md', loading, icon, iconRight,
  fullWidth, children, className, disabled, ...props
}: VaButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-va-blue/40 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variants[variant], sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...(props as object)}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </motion.button>
  )
}
