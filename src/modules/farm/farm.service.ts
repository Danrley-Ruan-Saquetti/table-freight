import { HeaderController } from '../header/header.controller.js'
import { HeaderModelArgs } from '../header/header.model.js'
import { PlantController } from '../plant/plant.controller.js'
import { PlantModelArgs } from '../plant/plant.model.js'
import { PlantService } from '../plant/plant.service.js'
import { ProcessController } from '../process/process.controller.js'
import { Process } from '../process/process.model.js'
import { FarmController } from './farm.controller.js'
import { EnumProcess, ProcessInstance } from './process/index.js'

export class FarmService {
    readonly farmId: number
    private readonly farmController: FarmController
    private readonly headerController: HeaderController
    private readonly plantController: PlantController
    private readonly processController: ProcessController
    private readonly plantsService: PlantService[]
    private readonly processService: Process[]

    constructor(farmId: number) {
        this.farmId = farmId
        this.plantsService = []
        this.processService = []
        this.farmController = new FarmController()
        this.headerController = new HeaderController()
        this.plantController = new PlantController()
        this.processController = new ProcessController()
    }

    // # Use Case
    perform() {
        this.initComponents()

        this.processService.map(process => {
            const resultProcess = process.perform()

            console.log(resultProcess)
        })
    }

    // ## Setup
    private initComponents() {
        this.resetListPlantsService()
        this.resetListProcessService()
    }

    private resetListPlantsService() {
        this.plantsService.splice(0, this.plantsService.length)

        this.getPlants().map(plant => {
            const plantService = new PlantService(plant.id)

            this.plantsService.push(plantService)
        })
    }

    private resetListProcessService() {
        this.processService.splice(0, this.processService.length)

        this.getProcess().map(process => {
            const processService = new ProcessInstance[EnumProcess[process.type]](this.farmId)

            this.processService.push(processService)
        })
    }

    // # Logic

    // # Config
    insertPlant(...plants: (Omit<PlantModelArgs, 'farmId'> & { headers: Omit<HeaderModelArgs, 'tableId'>[] })[]) {
        plants.map(plantArg => {
            this.plantController.createPlant({ ...plantArg, farmId: this.farmId })
        })
    }

    insertServices(...tactics: EnumProcess[]) {
        tactics.map(process => {
            const ProcessValue = ProcessInstance[process]

            this.processController.create({ data: new ProcessValue(this.farmId) })
        })
    }

    // # Utils
    getState() {
        return this.farmController.findFirstIncludeAll({ where: { id: { equals: this.farmId } } })
    }

    private getPlants() {
        return this.plantController.findMany({ where: { farmId: { equals: this.farmId } } })
    }

    private getProcess() {
        return this.processController.findMany({ where: { farmId: { equals: this.farmId } } })
    }
}