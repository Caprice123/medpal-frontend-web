import { useState } from 'react'
import TagSelector from './TagSelector.js'
import { Modal, ModalHeader, ModalTitle, CloseButton, ModalBody, FormGroup, Label, Input, Select, Option, ButtonGroup, Button, FileUpload, FileName } from './TopicModal.styles.jsx'


function TopicModal({ isOpen, onClose, onSubmit, isGenerating }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [], // Array of tag objects
    type: 'text',
    content: '',
    file: null
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      handleChange('file', file)
    } else {
      alert('Hanya file PDF yang diperbolehkan')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title) {
      alert('Judul topik harus diisi')
      return
    }

    const hasUniversity = formData.tags.some(tag => tag.type === 'university')
    const hasSemester = formData.tags.some(tag => tag.type === 'semester')

    if (!hasUniversity) {
      alert('Minimal satu universitas harus dipilih')
      return
    }

    if (!hasSemester) {
      alert('Minimal satu semester harus dipilih')
      return
    }

    if (formData.type === 'text' && !formData.content) {
      alert('Konten teks harus diisi')
      return
    }

    if (formData.type === 'pdf' && !formData.file) {
      alert('File PDF harus diupload')
      return
    }

    // Call parent's onSubmit
    onSubmit(formData)

    // Reset form
    setFormData({
      title: '',
      description: '',
      tags: [],
      type: 'text',
      content: '',
      file: null
    })
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Buat Topik Baru</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>Judul Topik *</Label>
              <Input
                type="text"
                placeholder="Contoh: Anatomi Jantung"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Deskripsi (Opsional)</Label>
              <Input
                type="text"
                placeholder="Deskripsi singkat tentang topik"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </FormGroup>

            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => handleChange('tags', tags)}
              type="university"
              label="Universitas"
              required
            />

            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => handleChange('tags', tags)}
              type="semester"
              label="Semester"
              required
            />

            <FormGroup>
              <Label>Tipe Input *</Label>
              <TypeSelector>
                <TypeOption
                  type="button"
                  selected={formData.type === 'text'}
                  onClick={() => handleChange('type', 'text')}
                >
                  <span>📝</span>
                  <span>Text</span>
                </TypeOption>
                <TypeOption
                  type="button"
                  selected={formData.type === 'pdf'}
                  onClick={() => handleChange('type', 'pdf')}
                >
                  <span>📄</span>
                  <span>PDF</span>
                </TypeOption>
              </TypeSelector>
            </FormGroup>

            {formData.type === 'text' && (
              <FormGroup>
                <Label>Konten Materi *</Label>
                <Textarea
                  placeholder="Masukkan materi yang akan digunakan untuk menghasilkan soal fill-in-the-blank..."
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  required
                />
              </FormGroup>
            )}

            {formData.type === 'pdf' && (
              <FormGroup>
                <Label>Upload PDF *</Label>
                <FileUpload>
                  <input
                    type="file"
                    id="pdf-upload"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="pdf-upload">
                    <div>📄</div>
                    <div style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                      {formData.file ? (
                        <FileName>{formData.file.name}</FileName>
                      ) : (
                        'Klik untuk upload file PDF'
                      )}
                    </div>
                  </label>
                </FileUpload>
              </FormGroup>
            )}
          </ModalBody>

          <ModalBody>
            <ButtonGroup>
              <Button type="button" onClick={onClose} disabled={isGenerating}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={isGenerating}>
                {isGenerating ? <LoadingSpinner /> : 'Generate Soal'}
              </Button>
            </ButtonGroup>
          </ModalBody>
        </form>
      </Modal>
    </Overlay>
  )
}

export default TopicModal
