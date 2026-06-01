codex/continue-the-discussion-4wozgx

codex/continue-with-the-project-1rb603
import { Loader2Icon } from "lucide-react";

main
import type { ComponentPropsWithoutRef } from "react"
import { Loader2Icon } from "lucide-react"
main

import { cn } from "@/lib/utils";

codex/continue-with-the-project-1rb603
function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2Icon>) {

codex/continue-the-discussion
function Spinner({ className, ...props }: ComponentPropsWithoutRef<"svg">) {

codex/continue-the-discussion-4wozgx
function Spinner({ className, ...props }: ComponentPropsWithoutRef<"svg">) {

function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2Icon>) {
main
main
main
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
