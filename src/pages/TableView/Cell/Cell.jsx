import { useEffect, useMemo } from "react";

const Cell = ({
  field,
  value,
  handleInputChange,
  rowIndex,
  fieldIndex,
  setSelectedCell,
  calculate,
}) => {
  const { type, options, maxLength, formula } = field;

  const calculateValue = useMemo(() => {
    if (!formula) return null;
    return calculate(formula, rowIndex);
  }, [formula, calculate, rowIndex]);

  useEffect(() => {
    if (
      type === "calc" &&
      calculateValue !== null &&
      calculateValue !== value
    ) {
      handleInputChange(rowIndex, fieldIndex, calculateValue);
      setSelectedCell((prev) => ({ ...prev, value: calculateValue }));
    }
  }, [
    calculateValue,
    handleInputChange,
    rowIndex,
    fieldIndex,
    setSelectedCell,
    type,
    value,
  ]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    handleInputChange(rowIndex, fieldIndex, newValue);
    setSelectedCell((prev) => ({ ...prev, value: newValue }));
  };

  const inputStyles =
    "bg-[#2e2e38] w-full p-2 text-[#d4d4dc] focus:ring-2 focus:ring-[#4ecca3] focus:outline-none";

  const renderInput = () => {
    switch (type) {
      case "text":
        return (
          <input
            className={inputStyles}
            type="text"
            value={value || ""}
            onChange={handleChange}
            maxLength={maxLength}
          />
        );
      case "number":
        return (
          <input
            className={inputStyles}
            type="number"
            value={value || ""}
            onChange={handleChange}
          />
        );
      case "boolean":
        return (
          <select className={inputStyles} value={value} onChange={handleChange}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case "select":
        return (
          <select className={inputStyles} value={value} onChange={handleChange}>
            <option value={value}>{value}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "calc":
        return (
          <input
            className={inputStyles}
            type="text"
            value={calculateValue ?? ""}
            disabled
          />
        );
      default:
        console.warn(`Unsupported input type: ${type}`);
        return (
          <input
            className={inputStyles}
            type="text"
            value={value}
            onChange={handleChange}
          />
        );
    }
  };

  return renderInput();
};

export default Cell;
