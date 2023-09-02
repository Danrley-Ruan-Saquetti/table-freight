import { Document } from '../../lib/repository-memory'

export interface FarmModelArgs { }

export type FarmModel = Document<FarmModelArgs>

export class Farm implements FarmModel {
    id: number
    updateAt: Date
    createAt: Date

    private constructor({ createAt, id, updateAt }: FarmModel) {
        this.id = id
        this.updateAt = updateAt
        this.createAt = createAt
    }

    static create({ }: FarmModelArgs) {
        // @ts-expect-error
        return new Farm({})
    }

    static instance({ createAt, id, updateAt }: FarmModel) {
        return new Farm({ createAt, id, updateAt })
    }
}