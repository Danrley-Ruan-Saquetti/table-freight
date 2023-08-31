import { Document } from '../../lib/repository-memory'

export enum PlantType {
    'Deadline' = 'Deadline',
    'Price' = 'Price',
    'Total' = 'Total',
    'TemplateDeadline' = 'TemplateDeadline',
    'TemplatePrice' = 'TemplatePrice',
    'TemplateRate' = 'TemplateRate',
}

export interface PlantModel {
    name: string
    type: PlantType
}

export class Plant implements PlantModel {
    name: string
    type: PlantType

    constructor({ type, name }: PlantModel) {
        this.name = name
        this.type = type
    }
}
