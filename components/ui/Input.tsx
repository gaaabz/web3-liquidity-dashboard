import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          w-full px-3 py-2 bg-secondary border rounded-lg text-foreground
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-destructive' : 'border-border'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
})

interface NumberInputProps extends Omit<InputProps, 'type'> {
  onValueChange?: (value: number | undefined) => void
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { onValueChange, onChange, ...props },
  ref
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (onValueChange) {
      onValueChange(value === '' ? undefined : parseFloat(value))
    }
    onChange?.(e)
  }

  return (
    <Input
      ref={ref}
      type="number"
      onChange={handleChange}
      {...props}
    />
  )
})
