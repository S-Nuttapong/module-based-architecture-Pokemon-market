import { Input, InputProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { InputChangeHandler } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { noop } from "lodash";

type OnNameSearch = (value: string) => void;
interface IPokemonSearch extends Omit<InputProps, "onChange" | "value"> {
  onSearch?: OnNameSearch;
  searchDelay?: number;
}
export const PokemonNameSearch = (props: IPokemonSearch) => {
  const { onSearch = noop, searchDelay, ...rest } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, searchDelay);

  const handleChange: InputChangeHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <Input
      w="173px"
      color="content.primary"
      placeholder="Search by name"
      value={searchTerm}
      onChange={handleChange}
      {...rest}
    />
  );
};