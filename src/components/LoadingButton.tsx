import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

//tento button je ktomu ze vezme loading state a ukaze loading indikator
export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled} //button je disabled kdyz loading / disabled je true
      className={cn("flex items-center gap-2", className)}
      {...props} //musime sprednout props aby byli pouzity!
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
}
