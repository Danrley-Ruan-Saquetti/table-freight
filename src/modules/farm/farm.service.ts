import { HeaderController } from '../header/header.controller.js'
import { PlantController } from '../plant/plant.controller.js'
import { PlantService } from '../plant/plant.service.js'
import { FarmController } from './farm.controller.js'

export class FarmService {
    readonly farmId: number
    private readonly farmController: FarmController
    private readonly headerController: HeaderController
    private readonly plantController: PlantController
    private readonly plantsService: PlantService[]

    constructor(farmId: number) {
        this.farmId = farmId
        this.plantsService = []
        this.farmController = new FarmController()
        this.headerController = new HeaderController()
        this.plantController = new PlantController()

        this.initComponents()
    }

    // # Setup
    private initComponents() {
        this.initComponentsPlantsService()
    }

    private initComponentsPlantsService() {
        this.getPlants().map(plant => {
            const plantService = new PlantService(plant.id)

            this.plantsService.push(plantService)
        })
    }

    // # Use Case
    perform() { }

    // # Logic

    // # Utils
    private getPlants() {
        return this.plantController.findMany({ where: { farmId: { equals: this.farmId } } })
    }
}