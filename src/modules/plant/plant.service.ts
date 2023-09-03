import { HeaderController } from '../header/header.controller.js'
import { PlantController } from './plant.controller.js'

export class PlantService {
    readonly plantId: number
    private readonly headerController: HeaderController
    private readonly plantController: PlantController

    constructor(plantId: number) {
        this.plantId = plantId
        this.headerController = new HeaderController()
        this.plantController = new PlantController()
    }

    getState() {
        const plant = this.plantController.findFirstIncludeHeaders({ where: { id: { equals: this.plantId } } })

        if (!plant) {
            throw new Error(`Plant not define with id ${this.plantId}`)
        }

        return plant
    }
}