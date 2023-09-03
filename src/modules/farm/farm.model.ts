import { Document } from '../../lib/repository-memory'

export interface FarmModelArgs {
    name: string
}

export type FarmModel = Document<FarmModelArgs>