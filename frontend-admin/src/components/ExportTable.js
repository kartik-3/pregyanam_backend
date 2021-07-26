import React, { useEffect, useState } from "react";
import ReactExport from "react-export-excel";
import Controls from "./controls/Controls";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportTable(props) {
  const {
    exportColumns,
    sheetName,
    recordsAfterPagingAndSorting,
    buttonText,
    buttonColor,
    fileName,
  } = props;

  const [data, setData] = useState([]);

  useEffect(async () => {
    let temp = recordsAfterPagingAndSorting();
    setData(temp);
  }, [props]);

  return (
    <ExcelFile
      element={
        <Controls.Button
          disabled={data.length <= 0}
          text={buttonText}
          color={buttonColor}
        />
      }
      filename={fileName}
    >
      <ExcelSheet data={data} name={sheetName}>
        {exportColumns.map((column, index) => (
          <ExcelColumn label={column.label} value={column.value} key={index} />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
}
