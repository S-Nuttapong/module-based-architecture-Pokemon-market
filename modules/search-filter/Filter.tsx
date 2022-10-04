import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { color, HStack, SelectProps } from "@chakra-ui/react";
import { OptionSelect } from "../../components/OptionSelect";
import { useApi } from "../../hooks/useApi";
import React, { useEffect, useMemo } from "react";

type FilterLabels = "Rarity" | "Type" | "Set";

type FilterTypes = Lowercase<FilterLabels>;

type FilterEventInput = Partial<Record<FilterTypes, string>>;

interface IPokemonFilter {
  onFilter: (input: FilterEventInput) => void;
  isLoading?: boolean;
}

const typeOptions = Object.entries(PokemonTCG.Type).map(([_, typeValue]) => ({
  value: typeValue,
  label: typeValue,
}));

const rarityOptions = Object.entries(PokemonTCG.Rarity).map(
  ([_, rarityValue]) => ({
    value: rarityValue,
    label: rarityValue,
  })
);

const styles: SelectProps = {
  minW: "fit-content",
  color: "content.primary",
  borderRadius: "8px",
  borderWidth: "1px",
  borderColor: "border.primary",
};

const SetFilter = ({ onFilter, isLoading }: IPokemonFilter) => {
  const [data, getAllSets] = useApi(PokemonTCG.getAllSets);

  const setOptions = useMemo(
    () =>
      data?.results?.map((result) => ({
        value: result.id,
        label: result.name,
      })) || [],
    [data.results]
  );

  useEffect(() => {
    getAllSets();
  }, []);

  return (
    <OptionSelect
      {...styles}
      minW="280px"
      placeholder="Set"
      isDisabled={data.isLoading || isLoading}
      options={setOptions}
      onChange={(e) => onFilter({ set: e.target.value })}
    />
  );
};

export const PokemonFilter = ({ onFilter, isLoading }: IPokemonFilter) => (
  <HStack spacing="16px">
    <SetFilter onFilter={onFilter} isLoading={isLoading} />
    <OptionSelect
      {...styles}
      placeholder="Rarity"
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
  </HStack>
);
