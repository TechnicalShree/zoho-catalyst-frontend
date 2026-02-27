import { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  wrapperClassName?: string;
};

export function InputField({
  label,
  wrapperClassName = "",
  className = "",
  ...inputProps
}: InputFieldProps) {
  return (
    <label className={`input-group ${wrapperClassName}`.trim()}>
      {label}
      <input className={className} {...inputProps} />
    </label>
  );
}
