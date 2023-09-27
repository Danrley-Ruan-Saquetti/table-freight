import { Document } from '../../lib/repository-memory'

export enum HeaderType {
    ZipCodeInitial = 'ZipCodeInitial',
    ZipCodeFinal = 'ZipCodeFinal',
    ZipCodeOriginInitial = 'ZipCodeOriginInitial',
    ZipCodeOriginFinal = 'ZipCodeOriginFinal',
    Deadline = 'Deadline',
    DeadlineMoreD = 'DeadlineMoreD',
    CriteriaSelection = 'CriteriaSelection',
    Excess = 'Excess',
    Freight = 'Freight',
}

export interface HeaderModelArgs {
    tableId: number
    type: HeaderType
    name: string
    column: number
}

export type HeaderModel = Document<HeaderModelArgs>
