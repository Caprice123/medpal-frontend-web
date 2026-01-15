import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'

export class GenerateDiagramService extends BaseService {
  static async call({ tabId, userId, diagramConfig }) {
    const { type, detailLevel, orientation, layoutStyle, description } = diagramConfig

    // Validate required fields
    if (!description || !description.trim()) {
        throw new ValidationError('Deskripsi diagram tidak boleh kosong')
    }

    if (!type) {
        throw new ValidationError('Tipe diagram tidak boleh kosong')
    }

    // Verify ownership through the set
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab not found')
    }

    // Verify tab type is diagram_builder
    if (tab.tab_type !== 'diagram_builder') {
      throw new ValidationError('This tab is not a diagram builder tab')
    }

    // Fetch constants for access control
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_is_active',
            'skripsi_access_type',
            'skripsi_diagram_builder_enabled',
            'skripsi_diagram_builder_cost'
          ]
        }
      }
    })
    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if feature is globally active
    const featureActive = constantsMap.skripsi_is_active === 'true'
    if (!featureActive) {
      throw new ValidationError('Fitur Skripsi Builder sedang tidak aktif. Silakan coba beberapa saat lagi')
    }

    // Check if diagram builder is enabled
    const diagramBuilderEnabled = constantsMap.skripsi_diagram_builder_enabled === 'true'
    if (!diagramBuilderEnabled) {
      throw new ValidationError('Fitur Diagram Builder sedang tidak aktif')
    }

    // Check user access based on access type
    const accessType = constantsMap.skripsi_access_type || 'subscription'
    const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

    // For subscription_and_credits: subscribers get free access, non-subscribers need credits
    let diagramCost = 0
    let hasSubscription = false

    if (requiresSubscription) {
      hasSubscription = await HasActiveSubscriptionService.call(userId)

      // If subscription_and_credits mode and user has subscription, they get free access
      if (accessType === 'subscription_and_credits' && hasSubscription) {
        // Free for subscribers, skip credit check
      } else if (!hasSubscription && accessType === 'subscription') {
        // Subscription only mode and no subscription
        throw new ValidationError('Anda memerlukan langganan aktif untuk menggunakan fitur Diagram Builder')
      }
    }

    // Check credits if required (and not bypassed by subscription)
    if (requiresCredits && (!hasSubscription || accessType === 'credits')) {
      diagramCost = parseFloat(constantsMap.skripsi_diagram_builder_cost) || 0

      if (diagramCost > 0) {
        // Get user's credit balance
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        if (!userCredit || userCredit.balance < diagramCost) {
          throw new ValidationError(`Kredit tidak cukup. Anda memerlukan ${diagramCost} kredit untuk membuat diagram`)
        }
      }
    }

    // Get diagram builder constants (model and system prompt)
    const diagramConstants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_diagram_builder_model',
            'skripsi_diagram_builder_prompt'
          ]
        }
      }
    })

    const diagramConstantsMap = {}
    diagramConstants.forEach(c => { diagramConstantsMap[c.key] = c.value })

    const modelName = diagramConstantsMap.skripsi_diagram_builder_model || 'gemini-2.0-flash-exp'
    const systemPrompt = diagramConstantsMap.skripsi_diagram_builder_prompt

    if (!systemPrompt) {
      throw new ValidationError('System prompt untuk Diagram Builder belum dikonfigurasi')
    }

    // Build user message
    const userMessage = `Generate an Excalidraw diagram with the following configuration:

Type: ${type}
Detail Level: ${detailLevel}
Orientation: ${orientation}
Layout Style: ${layoutStyle}

Description:
${description}

Please return a valid Excalidraw JSON structure. Make sure to only return the JSON and make it to be able to be parsed by JSON.parse().`

    // Get AI service from router
    const ModelService = RouterUtils.call(modelName)
    if (!ModelService) {
      throw new ValidationError(`Model ${modelName} tidak didukung`)
    }

    console.log(modelName)
    console.log("CALLED")
      const fullResponse = await ModelService.generateFromText(
        modelName,
        systemPrompt,
        [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
      )

      // TEST DATA - Comment out the API call above and uncomment this for testing
//       const fullResponse = `
// \`\`\`json
// {
//   "type": "excalidraw",
//   "version": 2,
//   "elements": [
//     {
//       "id": "mitokondria_rect_main",
//       "type": "rectangle",
//       "x": 250,
//       "y": 50,
//       "width": 150,
//       "height": 60,
//       "strokeColor": "#000000",
//       "backgroundColor": "rgba(255, 255, 102, 0.4)",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "roundness": { "type": 2 },
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [
//         { "id": "mitokondria_text_main", "type": "text" }
//       ],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "A-oB2n5J",
//       "isDeleted": false,
//       "seed": 1684347781
//     },
//     {
//       "id": "mitokondria_text_main",
//       "type": "text",
//       "x": 260,
//       "y": 70,
//       "width": 130,
//       "height": 20,
//       "text": "Mitokondria",
//       "fontSize": 20,
//       "fontFamily": 1,
//       "textAlign": "center",
//       "verticalAlign": "middle",
//       "containerId": "mitokondria_rect_main",
//       "strokeColor": "#000000",
//       "backgroundColor": "transparent",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "B-aC3m6K",
//       "isDeleted": false,
//       "seed": 1684347782
//     },
//     {
//       "id": "pembangkit_energi_rect",
//       "type": "rectangle",
//       "x": 50,
//       "y": 200,
//       "width": 150,
//       "height": 60,
//       "strokeColor": "#000000",
//       "backgroundColor": "rgba(153, 204, 255, 0.4)",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "roundness": { "type": 2 },
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [
//         { "id": "pembangkit_energi_text", "type": "text" }
//       ],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "C-cD4n7L",
//       "isDeleted": false,
//       "seed": 1684347783
//     },
//     {
//       "id": "pembangkit_energi_text",
//       "type": "text",
//       "x": 60,
//       "y": 210,
//       "width": 130,
//       "height": 40,
//       "text": "Pembangkit\nEnergi (ATP)",
//       "fontSize": 16,
//       "fontFamily": 1,
//       "textAlign": "center",
//       "verticalAlign": "middle",
//       "containerId": "pembangkit_energi_rect",
//       "strokeColor": "#000000",
//       "backgroundColor": "transparent",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "D-dE5o8M",
//       "isDeleted": false,
//       "seed": 1684347784
//     },
//     {
//       "id": "respirasi_seluler_rect",
//       "type": "rectangle",
//       "x": 250,
//       "y": 200,
//       "width": 150,
//       "height": 60,
//       "strokeColor": "#000000",
//       "backgroundColor": "rgba(255, 153, 204, 0.4)",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "roundness": { "type": 2 },
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [
//         { "id": "respirasi_seluler_text", "type": "text" }
//       ],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "E-eF6p9N",
//       "isDeleted": false,
//       "seed": 1684347785
//     },
//     {
//       "id": "respirasi_seluler_text",
//       "type": "text",
//       "x": 260,
//       "y": 210,
//       "width": 130,
//       "height": 40,
//       "text": "Respirasi\nSeluler",
//       "fontSize": 16,
//       "fontFamily": 1,
//       "textAlign": "center",
//       "verticalAlign": "middle",
//       "containerId": "respirasi_seluler_rect",
//       "strokeColor": "#000000",
//       "backgroundColor": "transparent",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "F-fG7q0O",
//       "isDeleted": false,
//       "seed": 1684347786
//     },
//     {
//       "id": "dna_mitokondria_rect",
//       "type": "rectangle",
//       "x": 450,
//       "y": 200,
//       "width": 150,
//       "height": 60,
//       "strokeColor": "#000000",
//       "backgroundColor": "rgba(204, 255, 153, 0.4)",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "roundness": { "type": 2 },
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [
//         { "id": "dna_mitokondria_text", "type": "text" }
//       ],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "G-gH8r1P",
//       "isDeleted": false,
//       "seed": 1684347787
//     },
//     {
//       "id": "dna_mitokondria_text",
//       "type": "text",
//       "x": 460,
//       "y": 220,
//       "width": 130,
//       "height": 20,
//       "text": "DNA Mitokondria",
//       "fontSize": 16,
//       "fontFamily": 1,
//       "textAlign": "center",
//       "verticalAlign": "middle",
//       "containerId": "dna_mitokondria_rect",
//       "strokeColor": "#000000",
//       "backgroundColor": "transparent",
//       "fillStyle": "solid",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "H-hI9s2Q",
//       "isDeleted": false,
//       "seed": 1684347788
//     },
//     {
//       "id": "arrow_mito_energi",
//       "type": "arrow",
//       "x": 0, "y": 0, "width": 0, "height": 0,
//       "points": [[0, 0], [0, 0]],
//       "startBinding": { "elementId": "mitokondria_rect_main", "focus": 0.5, "gap": 1 },
//       "endBinding": { "elementId": "pembangkit_energi_rect", "focus": 0.5, "gap": 1 },
//       "strokeColor": "#000000",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "startArrowhead": null,
//       "endArrowhead": "arrow",
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "I-iJ0t3R",
//       "isDeleted": false,
//       "seed": 1684347789
//     },
//     {
//       "id": "arrow_mito_respirasi",
//       "type": "arrow",
//       "x": 0, "y": 0, "width": 0, "height": 0,
//       "points": [[0, 0], [0, 0]],
//       "startBinding": { "elementId": "mitokondria_rect_main", "focus": 0.5, "gap": 1 },
//       "endBinding": { "elementId": "respirasi_seluler_rect", "focus": 0.5, "gap": 1 },
//       "strokeColor": "#000000",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "startArrowhead": null,
//       "endArrowhead": "arrow",
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "J-jK1u4S",
//       "isDeleted": false,
//       "seed": 1684347790
//     },
//     {
//       "id": "arrow_mito_dna",
//       "type": "arrow",
//       "x": 0, "y": 0, "width": 0, "height": 0,
//       "points": [[0, 0], [0, 0]],
//       "startBinding": { "elementId": "mitokondria_rect_main", "focus": 0.5, "gap": 1 },
//       "endBinding": { "elementId": "dna_mitokondria_rect", "focus": 0.5, "gap": 1 },
//       "strokeColor": "#000000",
//       "strokeWidth": 2,
//       "roughness": 1,
//       "startArrowhead": null,
//       "endArrowhead": "arrow",
//       "locked": false,
//       "opacity": 100,
//       "angle": 0,
//       "strokeSharpness": "sharp",
//       "boundElements": [],
//       "groupIds": [],
//       "frameId": null,
//       "updated": 1,
//       "version": 1,
//       "versionNonce": "K-kL2v5T",
//       "isDeleted": false,
//       "seed": 1684347791
//     }
//   ],
//   "appState": {
//     "viewBackgroundColor": "#ffffff",
//     "gridSize": 20,
//     "zenModeEnabled": false,
//     "viewModeEnabled": false,
//     "excalidrawActiveTool": {
//       "type": "selection"
//     },
//     "currentItemStrokeColor": "#000000",
//     "currentItemBackgroundColor": "transparent",
//     "currentItemFillStyle": "hachure",
//     "currentItemStrokeWidth": 1,
//     "currentItemStrokeSharpness": "sharp",
//     "currentItemRoughness": 1,
//     "currentItemOpacity": 100,
//     "currentItemFontFamily": 1,
//     "currentItemFontSize": 20,
//     "currentItemTextAlign": "left",
//     "currentItemStartArrowhead": null,
//     "currentItemEndArrowhead": "arrow",
//     "scrollX": -300,
//     "scrollY": -20,
//     "zoom": {
//       "value": 1
//     },
//     "theme": "light",
//     "activeEmbeddable": null,
//     "showHyperlinkPopup": false,
//     "selectedElementIds": {},
//     "previousSelectedElementIds": {},
//     "shouldCacheIgnoreZoom": false,
//     "toastMessage": null,
//     "openMenu": null,
//     "historySize": 100,
//     "allowWorkspaceChanges": false,
//     "currentChartType": "bar",
//     "detachedElements": [],
//     "lastPointerDownWith": "none",
//     "scrolledOutside": false,
//     "name": "Mitokondria Flowchart"
//   },
//   "files": {}
// }
// \`\`\`
      
//       `
      console.log('=== FULL RESPONSE START ===')
      console.log(fullResponse)
      console.log('=== FULL RESPONSE END ===')
      console.log('Response type:', typeof fullResponse)
      console.log('Response length:', fullResponse?.length)

      // Helper function to remove comments from JSON string
      const removeJsonComments = (jsonString) => {
        // Remove single-line comments (// ...)
        let cleaned = jsonString.replace(/\/\/.*$/gm, '');
        // Remove multi-line comments (/* ... */)
        cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
        // Remove trailing commas before closing braces/brackets
        cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
        return cleaned;
      };

      // Helper function to escape control characters in JSON string values
      const escapeControlCharacters = (jsonString) => {
        // More robust approach: escape all control characters that aren't already escaped
        let result = jsonString;

        // Handle newlines at start or after non-backslash
        result = result.replace(/(?<!\\)\n/g, '\\n');
        // Handle tabs at start or after non-backslash
        result = result.replace(/(?<!\\)\t/g, '\\t');
        // Handle carriage returns at start or after non-backslash
        result = result.replace(/(?<!\\)\r/g, '\\r');
        // Handle form feeds (use character class to avoid matching word boundary)
        result = result.replace(/(?<!\\)[\f]/g, '\\f');
        // Handle backspace (use character class [\b] not \b which matches word boundaries!)
        result = result.replace(/(?<!\\)[\b]/g, '\\b');

        return result;
      };

      // Parse the AI response to extract Excalidraw JSON
      let diagramData
      try {
        // Try to parse as JSON directly (AI with responseMimeType returns clean JSON)
        console.log('Attempting direct parse...')
        const cleanedResponse = removeJsonComments(fullResponse);
        console.log('Cleaned response (first 200 chars):', cleanedResponse.substring(0, 200))
        diagramData = JSON.parse(cleanedResponse)
      } catch (e) {
        console.log('Direct parse failed:', e.message);
        // If direct parse fails, try to extract JSON from markdown code blocks
        const jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/)
        console.log('Markdown match found:', !!jsonMatch)
        if (jsonMatch) {
          try {
            console.log('Attempting markdown extraction parse...')
            const cleanedJson = removeJsonComments(jsonMatch[1]);
            diagramData = JSON.parse(cleanedJson)
          } catch (e2) {
            console.error('Markdown parse failed:', e2.message);
            console.error('Problematic JSON (first 500 chars):', jsonMatch[1].substring(0, 500));
            throw new ValidationError(`AI gagal menghasilkan diagram yang valid: ${e2.message}`)
          }
        } else {
          // Try to extract any JSON-like structure
          const jsonStart = fullResponse.indexOf('{')
          const jsonEnd = fullResponse.lastIndexOf('}') + 1
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            try {
              const extractedJson = fullResponse.substring(jsonStart, jsonEnd);
              const cleanedJson = removeJsonComments(extractedJson);
              diagramData = JSON.parse(cleanedJson)
            } catch (e3) {
              console.error('Raw extraction parse failed:', e3.message);
              throw new ValidationError(`AI gagal menghasilkan diagram yang valid: ${e3.message}`)
            }
          } else {
            throw new ValidationError('AI gagal menghasilkan diagram yang valid')
          }
        }
      }

      // Validate Excalidraw structure
      if (!diagramData.elements || !Array.isArray(diagramData.elements)) {
        throw new ValidationError('Format diagram tidak valid')
      }

      // Save diagram to skripsi_diagrams table
      const diagram = await prisma.skripsi_diagrams.create({
        data: {
          tab_id: tabId,
          diagram_type: type,
          detail_level: detailLevel,
          orientation: orientation,
          layout_style: layoutStyle,
          description: description,
          diagram_data: JSON.stringify(diagramData),
          credits_used: diagramCost
        }
      })

      // Deduct credits if cost > 0
      if (diagramCost > 0) {
        // Get current balance
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        const balanceBefore = userCredit ? parseFloat(userCredit.balance.toString()) : 0
        const balanceAfter = balanceBefore - diagramCost

        // Deduct credits
        await prisma.user_credits.update({
          where: { user_id: userId },
          data: {
            balance: { decrement: diagramCost }
          }
        })

        // Log credit transaction
        await prisma.credit_transactions.create({
          data: {
            user_id: userId,
            user_credit_id: userCredit.id,
            amount: -diagramCost,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            type: 'deduction',
            description: `Diagram Builder - ${type}`
          }
        })
      }

      // Update tab and set timestamps
      await prisma.skripsi_tabs.update({
        where: { id: tabId },
        data: { updated_at: new Date() }
      })

      await prisma.skripsi_sets.update({
        where: { id: tab.set_id },
        data: { updated_at: new Date() }
      })

      return {
        diagramId: diagram.id,
        diagram: diagramData
      }
  }
}
