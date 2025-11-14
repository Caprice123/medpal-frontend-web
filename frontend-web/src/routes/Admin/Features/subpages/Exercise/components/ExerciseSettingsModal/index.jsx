import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchExerciseConstants, updateExerciseConstants } from '@store/exercise/action'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  HintText,
  VariableBadge,
  ModalFooter,
  Button,
  LoadingSpinner
} from './ExerciseSettingsModal.styles'

function ExerciseSettingsModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    exercise_feature_title: '',
    exercise_feature_description: '',
    exercise_generation_model: 'gemini-1.5-flash',
    exercise_generation_prompt: '',
    exercise_credit_cost: '10'
  })

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
    }
  }, [isOpen])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const keys = [
        'exercise_feature_title',
        'exercise_feature_description',
        'exercise_generation_model',
        'exercise_generation_prompt',
        'exercise_credit_cost'
      ]

      const constants = await dispatch(fetchExerciseConstants(keys))

      console.log('Fetched constants:', constants)

      setSettings(prevSettings => ({
        ...prevSettings,
        ...constants
      }))
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      // Don't show alert on initial load if settings don't exist yet
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    // Validation
    if (!settings.exercise_feature_title.trim()) {
      alert('Judul fitur tidak boleh kosong')
      return
    }

    if (!settings.exercise_generation_prompt.trim()) {
      alert('Prompt tidak boleh kosong')
      return
    }

    const creditCost = parseInt(settings.exercise_credit_cost)
    if (isNaN(creditCost) || creditCost < 0) {
      alert('Jumlah kredit harus berupa angka positif')
      return
    }

    setSaving(true)
    try {
      await dispatch(updateExerciseConstants(settings))

      alert('Pengaturan berhasil disimpan!')
      onClose()
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Gagal menyimpan pengaturan: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>⚙️ Pengaturan Fitur Latihan Soal</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner />
              <div style={{ marginTop: '1rem', color: '#6b7280' }}>Memuat pengaturan...</div>
            </div>
          ) : (
            <>
              <FormGroup>
                <Label>Judul Fitur *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Latihan Soal Fill-in-the-Blank"
                  value={settings.exercise_feature_title}
                  onChange={(e) => handleChange('exercise_feature_title', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi Fitur</Label>
                <Textarea
                  placeholder="Deskripsi singkat tentang fitur ini..."
                  value={settings.exercise_feature_description}
                  onChange={(e) => handleChange('exercise_feature_description', e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Model Generasi *</Label>
                <Select
                  value={settings.exercise_generation_model}
                  onChange={(e) => handleChange('exercise_generation_model', e.target.value)}
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Cepat)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Akurat)</option>
                  <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</option>
                </Select>
                <HintText>Model yang digunakan untuk generate soal</HintText>
              </FormGroup>

              <FormGroup>
                <Label>Prompt Generasi Soal *</Label>
                <Textarea
                  placeholder="Masukkan prompt untuk generate soal..."
                  value={settings.exercise_generation_prompt}
                  onChange={(e) => handleChange('exercise_generation_prompt', e.target.value)}
                  style={{ minHeight: '200px' }}
                />
                <HintText>
                  Gunakan variabel: <VariableBadge>{'{{context}}'}</VariableBadge> untuk materi dan{' '}
                  <VariableBadge>{'{{numberOfQuestions}}'}</VariableBadge> untuk jumlah soal
                </HintText>
              </FormGroup>

              <FormGroup>
                <Label>Jumlah Kredit per Generate *</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="10"
                  value={settings.exercise_credit_cost}
                  onChange={(e) => handleChange('exercise_credit_cost', e.target.value)}
                />
                <HintText>Kredit yang akan dikurangi setiap kali user generate soal</HintText>
              </FormGroup>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
            {saving ? <LoadingSpinner /> : '💾 Simpan Pengaturan'}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default ExerciseSettingsModal
