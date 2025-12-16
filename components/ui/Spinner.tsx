import { type HTMLAttributes } from 'react'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export function Spinner({ size = 'md', className = '', ...props }: SpinnerProps) {
  return (
    <div className={`${sizeClasses[size]} ${className}`} {...props}>
      <svg
        className="animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Spinner size="lg" className="text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
