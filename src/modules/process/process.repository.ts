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

export type ProcessCreateArgs = CreateArgs<ProcessModelArgs>
export type ProcessCreateManyArgs = CreateManyArgs<ProcessModelArgs>
export type ProcessDeleteArgs = DeleteArgs<ProcessModelArgs>
export type ProcessDeleteManyArgs = DeleteManyArgs<ProcessModelArgs>
export type ProcessFindArgs = FindArgs<Document<ProcessModelArgs>>
export type ProcessFindFirstArgs = FindFirstArgs<Document<ProcessModelArgs>>
export type ProcessFindIndexArgs = FindIndexArgs<Document<ProcessModelArgs>>
export type ProcessFindManyArgs = FindManyArgs<Document<ProcessModelArgs>>
export type ProcessFindManyIndexArgs = FindManyIndexArgs<Document<ProcessModelArgs>>
export type ProcessUpdateArgs = UpdateArgs<Document<ProcessModelArgs>>
export type ProcessUpdateManyArgs = UpdateManyArgs<Document<ProcessModelArgs>>

export class ProcessRepository extends ModelSchema {
    constructor() {
        super('Process')
    }
}