import type { ComponentPropsWithoutRef } from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

codex/continue-the-discussion
function Spinner({ className, ...props }: ComponentPropsWithoutRef<"svg">) {

function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2Icon>) {
main
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
