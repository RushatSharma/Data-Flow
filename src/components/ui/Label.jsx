import React from "react";
import { cn } from "../../lib/utils.js";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 block mb-2",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };