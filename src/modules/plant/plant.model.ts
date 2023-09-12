import { Table } from '../../@types/index.js'
import { Document } from '../../lib/repository-memory'

export enum PlantType {
    'Deadline' = 'Deadline',
    'Freight' = 'Freight',
    'Total' = 'Total',
    'TemplateDeadline' = 'TemplateDeadline',
    'TemplateFreight' = 'TemplateFreight',
    'TemplateRate' = 'TemplateRate',
}

export interface PlantModelArgs {
    name: string
    type: PlantType
    table: Table
    farmId: number
}

export type PlantModel = Document<PlantModelArgs>

export class Plant implements PlantModel {
    createAt: Date
    id: number
    updateAt: Date
    name: string
    type: PlantType
    table: Table
    farmId: number

    private constructor({ type, name, createAt, id, updateAt, table, farmId }: PlantModel) {
        this.name = name
        this.type = type
        this.id = id
        this.updateAt = updateAt
        this.createAt = createAt
        this.table = table
        this.farmId = farmId
    }

    static create({ type, name, table, farmId }: PlantModelArgs) {
        // @ts-expect-error
        return new Plant({ type, name, table, farmId })
    }

    static instance({ type, name, createAt, id, updateAt, table, farmId }: PlantModel) {
        return new Plant({ type, name, createAt, id, updateAt, table, farmId })
    }
}
