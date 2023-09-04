import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { OrderTableProcess } from './order-table.process.js'

export enum EnumProcess {
    OrderTable = 'OrderTable',
}

export const ProcessInstance: { [x in keyof typeof EnumProcess]: new (args: ProcessChildrenCreate) => Process } = {
    OrderTable: OrderTableProcess,
}

export type ProcessRelation = { active?: boolean }

export const ProcessRelations: { [x in keyof typeof EnumProcess]: ProcessRelation } = {
    OrderTable: {},
}
