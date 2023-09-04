import { Table } from '../../@types/index.js'

export class TableController {
    converterStringInTable(tableInString: string, columnSeparatorCharacter = ';') {
        return tableInString
            .trim()
            .split(/\r?\n/g)
            .map(line => line.split(columnSeparatorCharacter).map(col => col.trim()))
    }

    orderTableByColumn(table: Table, column: number) {
        const tableOrdered = [table[0], ...table.slice(1).sort((lineA, lineB) => Number(lineA[column]) - Number(lineB[column]))]

        return tableOrdered
    }
}
