import { Select, SelectProps } from "@chakra-ui/react";

type OptionValue = string | ReadonlyArray<string> | number | undefined;
type Option<T extends OptionValue> = { value: T; label: string; id?: string };
interface IOptionSelect<T extends OptionValue> extends SelectProps {
  options: Option<T>[];
}
export function OptionSelect<T extends OptionValue>(props: IOptionSelect<T>) {
  const { options, ...selectProps } = props;
  return (
    <Select {...selectProps}>
      {options.map(({ label, value, id }, index) => (
        //note: should be save to use index here, as we render static options list
        <option key={id || index} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}
