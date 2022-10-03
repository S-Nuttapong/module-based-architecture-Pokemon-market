import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { HStack, Select, SelectProps } from "@chakra-ui/react";
import { OptionSelect } from "../../components/OptionSelect";
import React from "react";

type FilterLabels = "Rarity" | "Type" | "Set";

type FilterTypes = Lowercase<FilterLabels>;

type FilterEventInput = Partial<Record<FilterTypes, string>>;

interface IPokemonFilter {
  onFilter: (input: FilterEventInput) => void;
}

const TypeOptions = Object.entries(PokemonTCG.Type).map(([_, typeValue]) => ({
  value: typeValue,
  label: typeValue,
}));

const RarityOptions = Object.entries(PokemonTCG.Rarity).map(
  ([_, rarityValue]) => ({
    value: rarityValue,
    label: rarityValue,
  })
);

const styles: SelectProps = {
  minW: "max-content",
  color: "content.primary",
  borderRadius: "8px",
  borderWidth: "1px",
  borderColor: "border.primary",
};

export const PokemonFilter = ({ onFilter }: IPokemonFilter) => (
  <HStack spacing="16px">
    <Select {...styles} placeholder="Set" />
    <OptionSelect
      {...styles}
      placeholder="Rarity"
      options={RarityOptions}
      onChange={(e) => onFilter({ rarity: e.target.value })}
    />
    <OptionSelect
      {...styles}
      placeholder="Type"
      options={TypeOptions}
      onChange={(e) => onFilter({ type: e.target.value })}
    />
  </HStack>
);
