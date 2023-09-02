import { Document } from '../../lib/repository-memory'

export enum HeaderType {
    CepInitial = 'CepInitial',
    CepFinal = 'CepFinal',
    Deadline = 'Deadline',
    CriteriaSelection = 'CriteriaSelection',
    Excess = 'Excess',
    Freight = 'Freight',
}

export interface HeaderModelArgs {
    tableId: number
    type: HeaderType
    name: string
    column: number
}

export type HeaderModel = Document<HeaderModelArgs>

export class Header implements HeaderModel {
    id: number
    updateAt: Date
    createAt: Date
    tableId: number
    type: HeaderType
    name: string
    column: number

    private constructor({ createAt, id, updateAt, tableId, type, name, column }: HeaderModel) {
        this.tableId = tableId
        this.id = id
        this.updateAt = updateAt
        this.createAt = createAt
        this.type = type
        this.name = name
        this.column = column
    }

    static create({ tableId, type, name, column }: HeaderModelArgs) {
        // @ts-expect-error
        return new Header({ tableId, type, name, column })
    }

    static instance({ createAt, id, updateAt, tableId, type, name, column }: HeaderModel) {
        return new Header({ createAt, id, updateAt, tableId, type, name, column })
    }
}