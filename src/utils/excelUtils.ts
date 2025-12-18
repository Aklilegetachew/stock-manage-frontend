import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import { type StockMovementReportItem } from "../services/reportService"
import { format } from "date-fns"

export const generateStockMovementExcel = async (
  data: StockMovementReportItem[],
  filters: {
    startDate?: string
    endDate?: string
    branchName?: string
    productName?: string
  }
) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Stock Movement Report")

  // Title
  worksheet.mergeCells("A1:I1")
  const titleCell = worksheet.getCell("A1")
  titleCell.value = "Stock Movement Report"
  titleCell.font = { name: "Arial", family: 4, size: 16, bold: true }
  titleCell.alignment = { horizontal: "center", vertical: "middle" }
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFEEEEEE" },
  }

  // Subtitle (Filters)
  worksheet.mergeCells("A2:I2")
  const subtitleCell = worksheet.getCell("A2")
  let subtitleText = `Generated on: ${format(new Date(), "MMM d, yyyy HH:mm")}`
  if (filters.startDate && filters.endDate) {
    subtitleText += ` | Range: ${filters.startDate} - ${filters.endDate}`
  }
  if (filters.branchName) subtitleText += ` | Branch: ${filters.branchName}`
  if (filters.productName) subtitleText += ` | Product: ${filters.productName}`

  subtitleCell.value = subtitleText
  subtitleCell.font = { italic: true, size: 10 }
  subtitleCell.alignment = { horizontal: "center" }

  // Headers
  const headers = [
    "Date",
    "Transaction #",
    "Product Name",
    "Type",
    "Size",
    "Branch",
    "Movement",
    "Quantity",
    "Remark",
  ]

  const headerRow = worksheet.getRow(4)
  headerRow.values = headers
  headerRow.font = { bold: true }
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDDDDDD" },
    }
    cell.border = {
      bottom: { style: "thin" },
    }
  })

  // Data
  data.forEach((item) => {
    const row = worksheet.addRow([
      format(new Date(item.date), "yyyy-MM-dd HH:mm"),
      item.transactionNumber || "-",
      item.productName,
      item.productType,
      item.productSize,
      item.branchName,
      item.transactionType,
      item.quantity,
      item.remark || "-",
    ])

    // Conditional formatting for Movement Type
    const typeCell = row.getCell(7)
    if (item.transactionType === "ADD") {
      typeCell.font = { color: { argb: "FF008000" } } // Green
    } else {
      typeCell.font = { color: { argb: "FFFF0000" } } // Red
    }

    // Alignments
    row.getCell(8).alignment = { horizontal: "right" }
  })

  // Auto column width
  worksheet.columns.forEach((column) => {
    let maxLength = 0
    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10
        if (columnLength > maxLength) {
          maxLength = columnLength
        }
      })
    }
    column.width = maxLength < 10 ? 10 : maxLength + 2
  })

  // Footer
  const footerRow = worksheet.addRow([])
  worksheet.mergeCells(`A${footerRow.number}:I${footerRow.number}`)
  const footerCell = worksheet.getCell(`A${footerRow.number}`)
  footerCell.value = "End of Report"
  footerCell.alignment = { horizontal: "center" }
  footerCell.font = { size: 9, color: { argb: "FF888888" } }

  // Generate Buffer
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  saveAs(blob, `Stock_Movement_Report_${format(new Date(), "yyyy-MM-dd")}.xlsx`)
}
