"use client";

import React from "react";
import Select, { MultiValue } from "react-select";

interface MultiSelectProps {
  label?: string;
  name: string;
  value: string[];
  options: string[];
  onChange: (name: string, value: string[]) => void;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, name, value = [], options = [], onChange, className = "" }) => {
  const formattedOptions = options.map((opt) => ({ value: opt, label: opt }));

  const formattedValue = formattedOptions.filter((opt) => value.includes(opt.value));

  const handleChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    const selectedValues = selectedOptions?.map((opt) => opt.value) || [];
    onChange(name, selectedValues);
  };

  return (
    <div className={`${className}`}>
      {label && <label className="block font-semibold mb-1">{label}</label>}
      <Select
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        isMulti
        name={name}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default MultiSelect;
