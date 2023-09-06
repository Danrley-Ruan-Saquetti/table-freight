import { Table } from '../../@types/index.js'

export class TableController {
    converterStringInTable(tableInString: string, columnSeparatorCharacter = ';') {
        return tableInString
            .trim()
            .split(/\r?\n/g)
            .map(line => line.split(columnSeparatorCharacter).map(col => col.trim()))
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

    addColumnInTable(table: Table, ...columns: { value: string; column: number }[]) {}
}
