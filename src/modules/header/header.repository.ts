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
} from '../../lib/repository-memory/index.js'
import { HeaderModelArgs } from './header.model'

export type HeaderCreateArgs = CreateArgs<HeaderModelArgs>
export type HeaderCreateManyArgs = CreateManyArgs<HeaderModelArgs>
export type HeaderDeleteArgs = DeleteArgs<HeaderModelArgs>
export type HeaderDeleteManyArgs = DeleteManyArgs<HeaderModelArgs>
export type HeaderFindArgs = FindArgs<Document<HeaderModelArgs>>
export type HeaderFindFirstArgs = FindFirstArgs<Document<HeaderModelArgs>>
export type HeaderFindIndexArgs = FindIndexArgs<Document<HeaderModelArgs>>
export type HeaderFindManyArgs = FindManyArgs<Document<HeaderModelArgs>>
export type HeaderFindManyIndexArgs = FindManyIndexArgs<Document<HeaderModelArgs>>
export type HeaderUpdateArgs = UpdateArgs<Document<HeaderModelArgs>>
export type HeaderUpdateManyArgs = UpdateManyArgs<Document<HeaderModelArgs>>

export class HeaderRepository extends ModelSchema<HeaderModelArgs> {
    constructor() {
        super('Header')
    }
}