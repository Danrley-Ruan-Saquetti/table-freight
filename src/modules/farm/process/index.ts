import { Process, ProcessChildrenCreate } from '../../process/process.model.js'
import { EnumProcess } from './constants.js'
import { CreatePlantTotalProcess } from './create-plant-total.process.js'
import { IncrementDeadlineProcess } from './increment-deadline.process.js'
import { ValidZipCodeContainedProcess } from './valid-zip-code-contained.process.js'

export const ProcessInstance: { [x in keyof typeof EnumProcess]: new (args: ProcessChildrenCreate) => Process } = {
    CreatePlantTotal: CreatePlantTotalProcess,
    ValidZipCodeContained: ValidZipCodeContainedProcess,
    IncrementDeadline: IncrementDeadlineProcess,
}

export type ProcessRelation = { name: string; active?: boolean; hidden?: boolean; preProcess?: EnumProcess[] }

export const ProcessRelations: { [x in keyof typeof EnumProcess]: ProcessRelation } = {
    CreatePlantTotal: { name: CreatePlantTotalProcess.ProcessName },
    ValidZipCodeContained: { name: ValidZipCodeContainedProcess.ProcessName },
    IncrementDeadline: { name: IncrementDeadlineProcess.ProcessName, preProcess: [EnumProcess.CreatePlantTotal] },
}
