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
import { PlantModel } from './plant.model.js'

export type PlantCreateArgs = CreateArgs<PlantModel>
export type PlantCreateManyArgs = CreateManyArgs<PlantModel>
export type PlantDeleteArgs = DeleteArgs<PlantModel>
export type PlantDeleteManyArgs = DeleteManyArgs<PlantModel>
export type PlantFindArgs = FindArgs<Document<PlantModel>>
export type PlantFindFirstArgs = FindFirstArgs<Document<PlantModel>>
export type PlantFindIndexArgs = FindIndexArgs<Document<PlantModel>>
export type PlantFindManyArgs = FindManyArgs<Document<PlantModel>>
export type PlantFindManyIndexArgs = FindManyIndexArgs<Document<PlantModel>>
export type PlantUpdateArgs = UpdateArgs<Document<PlantModel>>
export type PlantUpdateManyArgs = UpdateManyArgs<Document<PlantModel>>

export class PlantRepository extends ModelSchema<PlantModel> {
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
