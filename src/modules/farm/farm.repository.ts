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
import { FarmModel } from './farm.model'

export type FarmCreateArgs = CreateArgs<FarmModel>
export type FarmCreateManyArgs = CreateManyArgs<FarmModel>
export type FarmDeleteArgs = DeleteArgs<FarmModel>
export type FarmDeleteManyArgs = DeleteManyArgs<FarmModel>
export type FarmFindArgs = FindArgs<Document<FarmModel>>
export type FarmFindFirstArgs = FindFirstArgs<Document<FarmModel>>
export type FarmFindIndexArgs = FindIndexArgs<Document<FarmModel>>
export type FarmFindManyArgs = FindManyArgs<Document<FarmModel>>
export type FarmFindManyIndexArgs = FindManyIndexArgs<Document<FarmModel>>
export type FarmUpdateArgs = UpdateArgs<Document<FarmModel>>
export type FarmUpdateManyArgs = UpdateManyArgs<Document<FarmModel>>

export class FarmRepository extends ModelSchema {
    constructor() {
        super('Farm')
    }
}