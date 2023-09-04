import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { OrderTableProcess } from './order-table.process.js'
import { ValidZipCodeProcess } from './valid-zip-code.process.js'

export enum EnumProcess {
    ValidZipCode = 'ValidZipCode',
    OrderTable = 'OrderTable',
}

export const ProcessInstance: { [x in keyof typeof EnumProcess]: new (args: ProcessChildrenCreate) => Process } = {
    ValidZipCode: ValidZipCodeProcess,
    OrderTable: OrderTableProcess,
}

export type ProcessRelation = { active?: boolean }

export const ProcessRelations: { [x in keyof typeof EnumProcess]: ProcessRelation } = {
    OrderTable: {},
    ValidZipCode: {},
}
