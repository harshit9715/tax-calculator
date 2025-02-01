import * as React from "react"
import { Input } from "./input"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface InputWithMaxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onMax: () => void
  className?: string
}

const InputWithMax = React.forwardRef<HTMLInputElement, InputWithMaxProps>(
  ({ className, onMax, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn("pr-16", className)}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute right-1 top-1 h-7 w-14"
          onClick={(e) => {
            e.preventDefault()
            onMax()
          }}
        >
          Max
        </Button>
      </div>
    )
  }
)
InputWithMax.displayName = "InputWithMax"

export { InputWithMax } 