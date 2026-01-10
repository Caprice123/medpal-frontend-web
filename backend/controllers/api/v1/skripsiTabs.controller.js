import { GetTabMessagesService } from '#services/skripsi/getTabMessagesService'
import { SendMessageService } from '#services/skripsi/sendMessageService'
import prisma from '#prisma/client'

class SkripsiTabsController {
  // Get messages for a tab with pagination
  async getMessages(req, res) {
    const userId = req.user.id
    const tabId = parseInt(req.params.tabId)
    const { limit, beforeMessageId } = req.query

    const result = await GetTabMessagesService.call({
      tabId,
      userId,
      limit: parseInt(limit) || 50,
      beforeMessageId: beforeMessageId ? parseInt(beforeMessageId) : null
    })
    console.log(result.messages)

    return res.status(200).json({
      data: result.messages,
      hasMore: result.hasMore
    })
  }

  // Send a message and get AI response (with streaming)
  async sendMessage(req, res) {
    const userId = req.user.id
    const tabId = parseInt(req.params.id)
    const { message } = req.body

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Track if client disconnected and create AbortController for streaming
    let clientDisconnected = false
    const streamAbortController = new AbortController()

    // Detect when client disconnects (e.g., clicks stop button or closes tab)
    req.on('close', () => {
      console.log('🔴 req.on("close") fired - Client disconnected')
      clientDisconnected = true
      streamAbortController.abort() // Abort the AI stream
    })

    res.on('close', () => {
      console.log('🔴 res.on("close") fired - Response stream closed')
      clientDisconnected = true
      streamAbortController.abort()
    })

    // Handle response errors
    res.on('error', (err) => {
      console.log('🔴 res.on("error") fired:', err.message)
      clientDisconnected = true
      streamAbortController.abort()
    })

    try {
      await SendMessageService.call({
        tabId,
        userId,
        message,
        streamAbortSignal: streamAbortController.signal,
        checkClientConnected: () => !clientDisconnected,
        onStream: (chunk, onSend) => {
          // Only send if client still connected
          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`)
            if (onSend) onSend() // Call callback if provided
          }
        },
        onComplete: (result) => {
          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify({ type: 'done', data: result })}\n\n`)
            res.end()
          }
        },
        onError: (error) => {
          if (!clientDisconnected) {
            res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
            res.end()
          }
        }
      })
    } catch (error) {
      if (!clientDisconnected) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
        res.end()
      }
    }
  }
}

export default new SkripsiTabsController()
