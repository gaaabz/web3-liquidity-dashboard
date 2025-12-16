import { type HTMLAttributes, type ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted text-foreground',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  outline: 'bg-transparent border-border text-muted-foreground',
}

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'in-range' | 'out-of-range' | 'warning'
  children?: ReactNode
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const config = {
    'in-range': { variant: 'success' as const, label: 'In Range' },
    'out-of-range': { variant: 'destructive' as const, label: 'Out of Range' },
    'warning': { variant: 'warning' as const, label: 'Warning' },
  }

  const { variant, label } = config[status]

  return (
    <Badge variant={variant}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        variant === 'success' ? 'bg-success' :
        variant === 'destructive' ? 'bg-destructive' :
        'bg-warning'
      }`} />
      {children ?? label}
    </Badge>
  )
}
