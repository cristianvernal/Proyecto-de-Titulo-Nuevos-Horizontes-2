import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useEffect, useState } from "react";

interface IPropsSelect {
  onChange: (value: any) => void;
  value: number;
}
export const SelectedComponent: React.FC<IPropsSelect> = ({onChange, value }) => {
  const [category, setCategory] = useState(`${value}`);

  useEffect(() => {
    onChange(category);
  }, [category]);

  return (
    <>
      <RadioGroup
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <FormControlLabel value="0" control={<Radio />} label="SI" />
        <FormControlLabel value="1" control={<Radio />} label="NO" />
      </RadioGroup>
    </>
  );
};
