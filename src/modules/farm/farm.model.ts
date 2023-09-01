import { Document } from '../../lib/repository-memory'

export interface FarmModelArgs {
    tablesId: number[]
}

export type FarmModel = Document<FarmModelArgs>

export class Farm implements FarmModel {
    tablesId: number[]
    id: number
    updateAt: Date
    createAt: Date

    private constructor({ createAt, id, updateAt, tablesId }: FarmModel) {
        this.id = id
        this.tablesId = tablesId
        this.updateAt = updateAt
        this.createAt = createAt
    }

    static create({ tablesId }: FarmModelArgs) {
        // @ts-expect-error
        return new Farm({ tablesId })
    }

    static instanceOf({ createAt, id, updateAt, tablesId }: FarmModel) {
        return new Farm({ createAt, id, updateAt, tablesId })
    }
}