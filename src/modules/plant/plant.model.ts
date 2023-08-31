import { Document } from '../../lib/repository-memory'

export enum PlantType {
    'Deadline' = 'Deadline',
    'Price' = 'Price',
    'Total' = 'Total',
    'TemplateDeadline' = 'TemplateDeadline',
    'TemplatePrice' = 'TemplatePrice',
    'TemplateRate' = 'TemplateRate',
}

export interface PlantModelArgs {
    name: string
    type: PlantType
}

export type PlantModel = Document<PlantModelArgs>

export class Plant implements PlantModel {
    createAt: Date
    id: number
    updateAt: Date
    name: string
    type: PlantType

    private constructor({ type, name, createAt, id, updateAt }: PlantModel) {
        this.name = name
        this.type = type
        this.id = id
        this.updateAt = updateAt
        this.createAt = createAt
    }

    static create({ type, name }: PlantModelArgs) {
        // @ts-expect-error
        return new Plant({ type, name })
    }

    static instanceOf({ type, name, createAt, id, updateAt }: PlantModel) {
        return new Plant({ type, name, createAt, id, updateAt })
    }
}
