import Cell from "../Cell/Cell";

const getFieldIndex = (fields, fieldName) => {
  return fields.findIndex((field) => field.name === fieldName);
};
const Row = ({
  handleCellClick,
  handleInputChange,
  rowIndex,
  tableData,
  sheet,
  setSelectedCell,
  selectedCell,
}) => {
  const calculate = (formula, rowIndex) => {
    if (sheet[rowIndex][formula[0]]) return null;
    //formula = ["fieldName1", "+", "fieldName2", "-", "fieldName3",...];

    const formulaWithValues = formula.map((item) => {
      const operators = ["+", "-", "*", "/", "(", ")"];
      if (
        !item.includes(operators[0]) &&
        !item.includes(operators[1]) &&
        !item.includes(operators[2]) &&
        !item.includes(operators[3])
      ) {
        return sheet[rowIndex][getFieldIndex(tableData.fields, item)];
      } else {
        return item;
      }
    });

    const finalFormula = formulaWithValues.join("");

    try {
      return eval(finalFormula);
    } catch (error) {
      return null;
    }
  };

  const handleSelectedRowStyle = (rowIndex) => {
    return rowIndex === selectedCell.row ? { backgroundColor: "#333842" } : {};
  };

  return (
    <tr
      key={rowIndex}
      className="border-b border-opacity-20 border-[#4b4b57] bg-[#2e2e38]"
      style={handleSelectedRowStyle(rowIndex)}
    >
      <td className="border border-[#4b4b57] p-2 text-[#d4d4dc]">
        <span>{rowIndex + 1}</span>
      </td>
      {tableData?.fields?.map((field, fieldIndex) => {
        const value = sheet[rowIndex] ? sheet[rowIndex][fieldIndex] : "";
        return (
          <td
            key={fieldIndex}
            className="border border-[#4b4b57] cursor-pointer"
            onClick={() => handleCellClick(rowIndex, fieldIndex, value)}
          >
            <Cell
              field={field}
              value={value}
              rowIndex={rowIndex}
              fieldIndex={fieldIndex}
              handleInputChange={handleInputChange}
              setSelectedCell={setSelectedCell}
              calculate={calculate}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default Row;
