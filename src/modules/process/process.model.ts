import { Document } from '../../lib/repository-memory/index.js'
import { Result } from '../../lib/result/index.js'
import { EnumProcess } from '../farm/process/constants.js'

export type ProcessModelArgs<ResultType = any, ParamsType = any> = {
    farmId: number
    type: EnumProcess
    order: number
    params: ParamsType[]
    result: Result<ResultType>
    name: string
}

export type ProcessModel<ResultType = any, ParamsType = any> = Document<ProcessModelArgs<ResultType, ParamsType>>
export type ProcessCreate<ResultType = any, ParamsType = any> = Omit<ProcessModel, 'params' | 'result' | 'createAt' | 'id' | 'updateAt'> & {
    params?: ParamsType[]
    createAt?: Date
    id?: number
    updateAt?: Date
    result?: Result<ResultType>
}
export type ProcessChildrenCreate<ResultType = any, ParamsType = any> = Omit<
    ProcessModel<ResultType, ParamsType>,
    'params' | 'result' | 'createAt' | 'id' | 'updateAt' | 'order' | 'type' | 'name'
> & {
    params?: ParamsType[]
    createAt?: Date
    id?: number
    updateAt?: Date
}

export class Process<ResultType = any, ParamsType = any> implements ProcessModel<ResultType, ParamsType> {
    farmId: number
    name: string
    type: EnumProcess
    order: number
    params: ParamsType[]
    result: Result<ResultType>
    createAt: Date
    id: number
    updateAt: Date

    constructor({ farmId, type, order, params = [], createAt, id, updateAt, result, name }: ProcessCreate<ResultType>) {
        this.farmId = farmId
        this.type = type
        this.order = order
        this.params = params
        this.name = name
        this.result = result || Result.failure({ title: `Process: ${this.name}`, message: 'Process not realized' })
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
