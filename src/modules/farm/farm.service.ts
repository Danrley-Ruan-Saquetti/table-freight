import { ModelSchema } from '../../common/repository.js'
import { Document, FindFirstResponse } from '../../lib/repository-memory/index.js'
import { HeaderModelArgs } from '../header/header.model.js'
import { PlantController } from '../plant/plant.controller.js'
import { PlantModelArgs } from '../plant/plant.model.js'
import { ProcessController } from '../process/process.controller.js'
import { ProcessService } from '../process/process.service.js'
import { FarmController } from './farm.controller.js'
import { FarmModelArgs } from './farm.model.js'
import { EnumProcess } from './process/constants.js'
import { ProcessInstance } from './process/index.js'
import { PreProcess } from './process/pre.process.js'

export class FarmService {
    readonly farmId: number
    private readonly farmController: FarmController
    private readonly plantController: PlantController
    private readonly processController: ProcessController
    private readonly preProcess: PreProcess

    constructor(farmId: number) {
        this.farmId = farmId

        this.farmController = new FarmController()
        this.plantController = new PlantController()
        this.processController = new ProcessController()
        this.preProcess = new PreProcess({ farmId: this.farmId })
    }

    // # Use Case
    perform() {
        this.initComponents()

        this.getProcess().map(process => {
            const processService = this.getProcessService(process)

            if (!processService) {
                return
            }

            processService.perform()
        })
    }

    // ## Setup
    private initComponents() {
        this.setupProcessService()
    }

    private setupProcessService() {
        this.preProcess.perform()
    }

    // # Config
    insertPlant(...plants: (Omit<PlantModelArgs, 'farmId'> & { headers: Omit<HeaderModelArgs, 'tableId'>[] })[]) {
        plants.map(plantArg => {
            this.plantController.createPlant({ ...plantArg, farmId: this.farmId })
        })
    }

    insertProcess(...process: { type: EnumProcess; params?: any[] }[]) {
        process.map(pro => {
            const ProcessServiceInstance = ProcessInstance[pro.type]

            this.processController.create({ data: new ProcessServiceInstance({ ...pro, farmId: this.farmId }) })
        })
    }

    private getProcessService({ id }: { id: number }) {
        return new ProcessService({ processId: id })
    }

    // # Utils
    getState() {
        return { farm: this.getFarm(), plants: this.getPlants(), process: this.getProcess() }
    }

    getFarm() {
        return this.farmController.findFirst({ where: { id: { equals: this.farmId } } }) as Document<FarmModelArgs>
    }

    getPlants() {
        return this.plantController.findManyIncludeHeaders({ where: { farmId: { equals: this.farmId } } })
    }

    getProcess() {
        return this.processController.findMany({ where: { farmId: { equals: this.farmId } } })
    }
}
