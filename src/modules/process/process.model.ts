import { Document } from '../../lib/repository-memory/index.js'
import { Result } from '../../lib/result/index.js'
import { EnumProcess } from '../farm/process/index.js'

export type ProcessModelArgs<T = any> = {
    farmId: number
    type: EnumProcess
    order: number
    params: any[]
    result: Result<T>
}

export type ProcessModel<T = any> = Document<ProcessModelArgs<T>>
export type ProcessCreate = Omit<ProcessModel, 'params' | 'result' | 'createAt' | 'id' | 'updateAt'> & {
    params?: any[]
    createAt?: Date
    id?: number
    updateAt?: Date
    result?: Result<T>
}
export type ProcessChildrenCreate = Omit<ProcessModel, 'params' | 'result' | 'createAt' | 'id' | 'updateAt' | 'order'> & {
    params?: any[]
    createAt?: Date
    id?: number
    updateAt?: Date
}

export class Process<T = any> implements ProcessModel<T> {
    farmId: number
    type: EnumProcess
    order: number
    params: any[]
    result: Result<T>
    createAt: Date
    id: number
    updateAt: Date

    constructor({ farmId, type, order, params = [], createAt, id, updateAt, result }: ProcessCreate) {
        this.farmId = farmId
        this.type = type
        this.order = order
        this.params = params
        this.result = result || Result.failure({ title: 'Result Process', message: 'Process not finalized' })
        // @ts-expect-error
        this.id = id
        // @ts-expect-error
        this.createAt = createAt
        // @ts-expect-error
        this.updateAt = updateAt
    }

    perform() {
        throw new Error('Method not implemented')
    }
}
