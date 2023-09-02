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
import { FarmModelArgs } from './farm.model'

export type FarmCreateArgs = CreateArgs<FarmModelArgs>
export type FarmCreateManyArgs = CreateManyArgs<FarmModelArgs>
export type FarmDeleteArgs = DeleteArgs<FarmModelArgs>
export type FarmDeleteManyArgs = DeleteManyArgs<FarmModelArgs>
export type FarmFindArgs = FindArgs<Document<FarmModelArgs>>
export type FarmFindFirstArgs = FindFirstArgs<Document<FarmModelArgs>>
export type FarmFindIndexArgs = FindIndexArgs<Document<FarmModelArgs>>
export type FarmFindManyArgs = FindManyArgs<Document<FarmModelArgs>>
export type FarmFindManyIndexArgs = FindManyIndexArgs<Document<FarmModelArgs>>
export type FarmUpdateArgs = UpdateArgs<Document<FarmModelArgs>>
export type FarmUpdateManyArgs = UpdateManyArgs<Document<FarmModelArgs>>

export class FarmRepository extends ModelSchema<FarmModelArgs> {
    constructor() {
        super('Farm')
    }
}