import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface MathDisplayProps {
  math: string
  inline?: boolean
  className?: string
}

export const MathDisplay = ({ math, inline = false, className = '' }: MathDisplayProps) => {
  try {
    if (inline) {
      return <InlineMath math={math} className={className} />
    }
    return (
      <div className={`my-2 ${className}`}>
        <BlockMath math={math} />
      </div>
    )
  } catch (error) {
    console.error('Error rendering LaTeX:', error, math)
    return <code className="text-sm text-red-500">{math}</code>
  }
}

export default MathDisplay

