import { Table } from '../../@types/index.js'

export class TableController {
    converterStringInTable(tableInString: string, columnSeparatorCharacter = ';') {
        return tableInString
            .trim()
            .split(/\r?\n/g)
            .map(line => line.split(columnSeparatorCharacter).map(col => col.trim()))
    }

    converterTableInString(table: Table, columnSeparatorCharacter = ';') {
        return table.map(line => line.join(columnSeparatorCharacter)).join('\r\n')
    }

    orderTableByColumn(table: Table, ...columns: number[]) {
        return table.sort((lineA, lineB) => {
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i]

                const result = Number(lineA[column]) - Number(lineB[column])

                if (result != 0) {
                    return result
                }
            }

            return -1
        })
    }

    getDistinctColumnValues(table: Table, columnIndex: number, excludes: number[] = []) {
        const column = table.filter((_, i) => excludes.findIndex(line => line == i) < 0).map(row => row[columnIndex])

        return column.filter((value, index, self) => self.indexOf(value) === index)
    }
}
