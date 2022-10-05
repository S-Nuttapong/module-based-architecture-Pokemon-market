import { Flex, SelectProps } from "@chakra-ui/react";
import { OptionSelect } from "../../components/OptionSelect";
import { useApi } from "../../hooks/useApi";
import React, { useEffect, useMemo } from "react";
import { pokemonCardServices } from "../../services/pokemonCardServices";

type FilterLabels = "Rarity" | "Type" | "Set";

type FilterTypes = Lowercase<FilterLabels>;

type FilterEventInput = Partial<Record<FilterTypes, string>>;

interface IPokemonFilter {
  onFilter: (input: FilterEventInput) => void;
  isLoading?: boolean;
}

const typeOptions = Object.entries(pokemonCardServices.Type).map(
  ([_, typeValue]) => ({
    value: typeValue,
    label: typeValue,
  })
);

const rarityOptions = Object.entries(pokemonCardServices.Rarity).map(
  ([_, rarityValue]) => ({
    value: rarityValue,
    label: rarityValue,
  })
);

const styles: SelectProps = {
  w: "fit-content",
  color: "content.primary",
  borderRadius: "8px",
  borderWidth: "1px",
  borderColor: "border.primary",
  flexGrow: 1,
};

const SetFilter = ({ onFilter, isLoading }: IPokemonFilter) => {
  const [data, getAllSets] = useApi(pokemonCardServices.getAllSets);

  const setOptions = useMemo(
    () =>
      data?.results?.map((result) => ({
        value: result.id,
        label: result.id,
      })) || [],
    [data.results]
  );

  useEffect(() => {
    getAllSets();
  }, []);

  return (
    <OptionSelect
      {...styles}
      flexGrow={1}
      minW="120px"
      placeholder="Set"
      isDisabled={data.isLoading || isLoading}
      options={setOptions}
      onChange={(e) => onFilter({ set: e.target.value })}
    />
  );
};

export const PokemonFilter = ({ onFilter, isLoading }: IPokemonFilter) => (
  <Flex gap="16px" wrap="wrap" w={["ful", "full", "unset", "unset"]}>
    <SetFilter onFilter={onFilter} isLoading={isLoading} />
    <OptionSelect
      {...styles}
      placeholder="Rarity"
      flexGrow={1.5}
      options={rarityOptions}
      isDisabled={isLoading}
      onChange={(e) => onFilter({ rarity: e.target.value })}
    />
    <OptionSelect
      {...styles}
      placeholder="Type"
      options={typeOptions}
      isDisabled={isLoading}
      onChange={(e) => onFilter({ type: e.target.value })}
    />
  </Flex>
);
