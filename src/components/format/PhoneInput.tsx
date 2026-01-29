import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

type PhoneInputBaseProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  "value" | "onChange"
>;

interface PhoneInputProps extends PhoneInputBaseProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6)
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, error, className, ...inputProps }, ref) => {
    return (
      <div className="relative">
        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="tel"
          className={`pl-10 ${className ?? ""}`}
          placeholder="0XX-XXX-XXXX"
          value={formatPhone(value)}
          {...inputProps}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
            onChange?.(raw);
          }}
        />
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
