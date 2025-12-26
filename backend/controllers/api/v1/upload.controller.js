import IDriveService from '#services/idrive.service'
import fs from 'fs'

class UploadController {
  /**
   * Upload image to S3 (iDrive)
   * @route POST /api/v1/upload/image
   * @param {string} type - Upload type (skripsi-editor, anatomy, flashcard, etc.)
   */
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided'
        })
      }

      console.log('Upload request - req.file:', req.file)
      console.log('Upload request - req.body:', req.body)

      const { type = 'general' } = req.body
      const filePath = req.file.path

      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: 'File path is missing',
          debug: { file: req.file }
        })
      }

      // Determine folder based on type
      const folderMap = {
        'skripsi-editor': 'skripsi-images',
        'anatomy': 'anatomy-images',
        'flashcard': 'flashcard-images',
        'exercise': 'exercise-images',
        'general': 'uploads'
      }

      const folder = folderMap[type] || 'uploads'

      // Upload to iDrive
      const result = await IDriveService.uploadFile(filePath, folder)

      // Generate presigned URL (expires in 7 days)
      const presignedUrl = await IDriveService.getSignedUrl(result.key, 7 * 24 * 60 * 60)

      // Delete temporary file
      fs.unlinkSync(filePath)

      return res.status(200).json({
        success: true,
        data: {
          url: presignedUrl,
          publicUrl: result.url,
          key: result.key,
          fileName: result.fileName
        }
      })
    } catch (error) {
      // Clean up temp file on error
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }

      console.error('Upload error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message
      })
    }
  }
}

export default new UploadController()
