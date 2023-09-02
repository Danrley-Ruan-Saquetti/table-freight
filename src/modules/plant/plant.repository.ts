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
import { PlantModelArgs } from './plant.model.js'

export type PlantCreateArgs = CreateArgs<PlantModelArgs>
export type PlantCreateManyArgs = CreateManyArgs<PlantModelArgs>
export type PlantDeleteArgs = DeleteArgs<PlantModelArgs>
export type PlantDeleteManyArgs = DeleteManyArgs<PlantModelArgs>
export type PlantFindArgs = FindArgs<Document<PlantModelArgs>>
export type PlantFindFirstArgs = FindFirstArgs<Document<PlantModelArgs>>
export type PlantFindIndexArgs = FindIndexArgs<Document<PlantModelArgs>>
export type PlantFindManyArgs = FindManyArgs<Document<PlantModelArgs>>
export type PlantFindManyIndexArgs = FindManyIndexArgs<Document<PlantModelArgs>>
export type PlantUpdateArgs = UpdateArgs<Document<PlantModelArgs>>
export type PlantUpdateManyArgs = UpdateManyArgs<Document<PlantModelArgs>>

export class PlantRepository extends ModelSchema<PlantModelArgs> {
    constructor() {
        super('Plant')
    }

    findBydIds(ids: number[]) {
        return this.findMany({
            where: {
                OR: ids.map(id => ({ id: { equals: id } }))
            }
        })
    }
}
