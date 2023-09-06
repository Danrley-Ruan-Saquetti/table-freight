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
import { ProcessModelArgs } from './process.model.js'

export type ProcessCreateArgs<T = any, P = any> = CreateArgs<ProcessModelArgs<T, P>>
export type ProcessCreateManyArgs<T = any, P = any> = CreateManyArgs<ProcessModelArgs<T, P>>
export type ProcessDeleteArgs<T = any, P = any> = DeleteArgs<ProcessModelArgs<T, P>>
export type ProcessDeleteManyArgs<T = any, P = any> = DeleteManyArgs<ProcessModelArgs<T, P>>
export type ProcessFindArgs<T = any, P = any> = FindArgs<Document<ProcessModelArgs<T, P>>>
export type ProcessFindFirstArgs<T = any, P = any> = FindFirstArgs<Document<ProcessModelArgs<T, P>>>
export type ProcessFindIndexArgs<T = any, P = any> = FindIndexArgs<Document<ProcessModelArgs<T, P>>>
export type ProcessFindManyArgs<T = any, P = any> = FindManyArgs<Document<ProcessModelArgs<T, P>>>
export type ProcessFindManyIndexArgs<T = any, P = any> = FindManyIndexArgs<Document<ProcessModelArgs<T, P>>>
export type ProcessUpdateArgs<T = any, P = any> = UpdateArgs<Document<ProcessModelArgs<T, P>>>
export type ProcessUpdateManyArgs<T = any, P = any> = UpdateManyArgs<Document<ProcessModelArgs<T, P>>>

export class ProcessRepository extends ModelSchema<ProcessModelArgs> {
    constructor() {
        super('Process')
    }
}
