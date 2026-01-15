import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'

export class UpdateDiagramService extends BaseService {
  static async call({ diagramId, userId, diagramData }) {
    if (!diagramData) {
        throw new ValidationError('Data diagram tidak boleh kosong')
    }
    // Find the diagram and verify ownership
    const diagram = await prisma.skripsi_diagrams.findFirst({
      where: {
        id: diagramId
      },
      include: {
        skripsi_tab: {
          include: {
            skripsi_set: true
          }
        }
      }
    })

    if (!diagram) {
      throw new NotFoundError('Diagram tidak ditemukan')
    }

    // Verify ownership through set
    if (diagram.skripsi_tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Diagram tidak ditemukan')
    }

    // Validate diagram data structure
    if (typeof diagramData !== 'object' || !diagramData.elements || !Array.isArray(diagramData.elements)) {
      throw new ValidationError('Format diagram tidak valid')
    }

    // Update diagram
    const updatedDiagram = await prisma.skripsi_diagrams.update({
      where: {
        id: diagramId
      },
      data: {
        diagram_data: JSON.stringify(diagramData)
      }
    })

    // Update tab timestamp
    await prisma.skripsi_tabs.update({
      where: { id: diagram.tab_id },
      data: { updated_at: new Date() }
    })

    // Update set timestamp
    await prisma.skripsi_sets.update({
      where: { id: diagram.skripsi_tab.set_id },
      data: { updated_at: new Date() }
    })

    return {
      diagramId: updatedDiagram.id,
      diagram: JSON.parse(updatedDiagram.diagram_data)
    }
  }
}
