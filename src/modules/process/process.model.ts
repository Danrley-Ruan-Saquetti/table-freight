import { Result } from '../../lib/result/index.js'
import { EnumProcess } from '../farm/process/index.js'

export type ProcessModel = {
    farmId: number
    type: EnumProcess
    order: number
}

export class Process<T = any> implements ProcessModel {
    public farmId: number
    public type: EnumProcess
    public order: number

    constructor({ farmId, type, order }: ProcessModel) {
        this.farmId = farmId
        this.type = type
        this.order = order
    }

    perform(): Result<T> {
        throw new Error('Method not implemented')
    }
}