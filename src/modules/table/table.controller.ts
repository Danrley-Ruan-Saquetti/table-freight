export class TableController {

    converterStringInTable(tableInString: string, columnSeparatorCharacter = ';') {
        return tableInString.trim().split(/\r?\n/g).map(line => line.split(columnSeparatorCharacter).map(col => col.trim()))
    }
}