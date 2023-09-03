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
import { ProcessModel } from './process.model.js'

export type ProcessCreateArgs = CreateArgs<ProcessModel>
export type ProcessCreateManyArgs = CreateManyArgs<ProcessModel>
export type ProcessDeleteArgs = DeleteArgs<ProcessModel>
export type ProcessDeleteManyArgs = DeleteManyArgs<ProcessModel>
export type ProcessFindArgs = FindArgs<Document<ProcessModel>>
export type ProcessFindFirstArgs = FindFirstArgs<Document<ProcessModel>>
export type ProcessFindIndexArgs = FindIndexArgs<Document<ProcessModel>>
export type ProcessFindManyArgs = FindManyArgs<Document<ProcessModel>>
export type ProcessFindManyIndexArgs = FindManyIndexArgs<Document<ProcessModel>>
export type ProcessUpdateArgs = UpdateArgs<Document<ProcessModel>>
export type ProcessUpdateManyArgs = UpdateManyArgs<Document<ProcessModel>>

export class ProcessRepository extends ModelSchema {
    constructor() {
        super('Process')
    }
}