import {
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { InputChangeHandler } from "../../@types/eventHandlers";
import { SearchIcon } from "@chakra-ui/icons";
import { noop } from "../../utils/common";

type OnNameSearch = (value: string) => void;
export interface ISearch extends InputGroupProps {
  onSearch?: OnNameSearch;
  searchDelay?: number;
}

export const Search = (props: ISearch) => {
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
    <InputGroup {...rest}>
      <InputLeftElement pointerEvents="none" display="inherit">
        <SearchIcon color="content.primary" display="inherit" />
      </InputLeftElement>
      <Input
        color="content.primary"
        placeholder="Search by name"
        borderRadius="8px"
        borderWidth="1px"
        borderColor="border.primary"
        value={searchTerm}
        onChange={handleChange}
        display="inherit"
      />
    </InputGroup>
  );
};
