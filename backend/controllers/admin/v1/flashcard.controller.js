import { GenerateFlashcardService } from '../../../services/flashcard/admin/generateFlashcardService.js'
import { CreateFlashcardDeckService } from '../../../services/flashcard/admin/createFlashcardDeckService.js'
import { GetFlashcardDecksService } from '../../../services/flashcard/getFlashcardDecksService.js'
import { GetFlashcardDeckDetailService } from '../../../services/flashcard/admin/getFlashcardDeckDetailService.js'
import { UpdateFlashcardCardsService } from '../../../services/flashcard/admin/updateFlashcardCardsService.js'
import idriveService from '../../../services/idrive.service.js'

class FlashcardController {
    
  async index(req, res) {
    const { university, semester } = req.query

    const decks = await GetFlashcardDecksService.call({ university, semester })

    return res.status(200).json({
      data: decks
    })
  }

  async create(req, res) {
    const {
      title,
      description,
      content_type,
      content,
      pdf_url,
      pdf_key,
      pdf_filename,
      tags,
      cards
    } = req.body

    const deck = await CreateFlashcardDeckService.call({
      title,
      description,
      content_type,
      content,
      pdf_url,
      pdf_key,
      pdf_filename,
      tags,
      cards,
      created_by: req.user.id
    })

    return res.status(201).json({
      data: deck,
    })
  }
  
  async show(req, res) {
    const { id } = req.params

    const deck = await GetFlashcardDeckDetailService.call(id)

    return res.status(200).json({
      data: deck
    })
  }

  async update(req, res) {
    const { id } = req.params
    const { cards } = req.body

    const updatedDeck = await UpdateFlashcardCardsService.call(id, cards)

    return res.status(200).json({
      data: updatedDeck
    })
  }

  async generateCards(req, res) {
    const { content, type, cardCount = 10 } = req.body

    const cards = await GenerateFlashcardService.call({ content, type, cardCount })

    return res.status(200).json({
      data: cards
    })
  }

  async generateCardsFromPDF(req, res) {
    const { cardCount = 10 } = req.body

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      })
    }

    // Upload PDF to iDrive E2 cloud storage
    const uploadResult = await idriveService.uploadFlashcardPDF(
      req.file.path,
      req.file.originalname.replace('.pdf', '')
    )

    // Generate flashcards from the uploaded PDF
    const cards = await GenerateFlashcardService.call({
      pdfFilePath: req.file.path,
      type: 'pdf',
      cardCount: parseInt(cardCount) || 10
    })

    return res.status(200).json({
      data: {
        cards: cards,
        pdf_url: uploadResult.url,
        pdf_key: uploadResult.key,
        pdf_filename: uploadResult.fileName
      }
    })
  }
}

export default new FlashcardController()
