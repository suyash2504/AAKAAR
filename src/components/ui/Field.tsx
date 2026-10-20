import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface Base { label: string; error?: string; hint?: ReactNode; optional?: boolean }

function Wrap({ id, label, error, hint, optional, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="font-medium text-muted">(optional)</span>}
      </label>
      {children}
      {error ? <p id={`${id}-err`} className="field-error" role="alert">{error}</p> : hint ? <p id={`${id}-hint`} className="field-hint">{hint}</p> : null}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: ReactNode) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined)

export function TextField({ label, error, hint, optional, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional}>
      <input id={id} className="field-input" aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </Wrap>
  )
}

export function TextArea({ label, error, hint, optional, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional}>
      <textarea id={id} className="field-input" aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} {...rest} />
    </Wrap>
  )
}

export function SelectField({ label, error, hint, optional, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <Wrap id={id} label={label} error={error} hint={hint} optional={optional}>
      <select id={id} className="field-input" aria-invalid={!!error} aria-describedby={describedBy(id, error, hint)} {...rest}>
        {children}
      </select>
    </Wrap>
  )
}
