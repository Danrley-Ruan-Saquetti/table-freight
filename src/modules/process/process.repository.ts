import { ModelSchema } from '../../common/repository.js'
import {
    CreateArgs,
    CreateManyArgs,
    DeleteArgs,
    DeleteManyArgs,
    FindArgs,
    FindFirstArgs,
    FindIndexArgs,
    FindManyArgs,
    FindManyIndexArgs,
    UpdateArgs,
    UpdateManyArgs,
    Document,
} from './../../lib/repository-memory/index.js'
import { Process } from './process.model.js'

export type ProcessCreateArgs<T = any> = CreateArgs<Process<T>>
export type ProcessCreateManyArgs<T = any> = CreateManyArgs<Process<T>>
export type ProcessDeleteArgs<T = any> = DeleteArgs<Process<T>>
export type ProcessDeleteManyArgs<T = any> = DeleteManyArgs<Process<T>>
export type ProcessFindArgs<T = any> = FindArgs<Document<Process<T>>>
export type ProcessFindFirstArgs<T = any> = FindFirstArgs<Document<Process<T>>>
export type ProcessFindIndexArgs<T = any> = FindIndexArgs<Document<Process<T>>>
export type ProcessFindManyArgs<T = any> = FindManyArgs<Document<Process<T>>>
export type ProcessFindManyIndexArgs<T = any> = FindManyIndexArgs<Document<Process<T>>>
export type ProcessUpdateArgs<T = any> = UpdateArgs<Document<Process<T>>>
export type ProcessUpdateManyArgs<T = any> = UpdateManyArgs<Document<Process<T>>>

export class ProcessRepository extends ModelSchema {
    constructor() {
        super('Process')
    }
}