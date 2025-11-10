import { useState } from 'react'
import FeaturesList from './components/FeaturesList'
import FeatureConfig from './components/FeatureConfig'
import LatihanSoal from './subpages/LatihanSoal'
import {
  Container,
  HeaderSection,
  SectionTitle,
  LoadingState,
  ErrorMessage
} from './Features.styles'

// Mock data for the 7 features
const FEATURES_DATA = [
  {
    id: 1,
    name: 'Asisten Diagnosis AI',
    description: 'Dapatkan saran diagnosis bertenaga AI berdasarkan gejala dan riwayat medis pasien',
    icon: '🔬',
    cost: 10,
    isActive: true,
    color: '#0891b2'
  },
  {
    id: 2,
    name: 'Latihan Soal',
    description: 'Latihan soal dengan sistem fill-in-the-blank yang dihasilkan AI',
    icon: '✏️',
    cost: 5,
    isActive: true,
    color: '#8b5cf6'
  },
  {
    id: 3,
    name: 'Bank Soal Medis',
    description: 'Latihan soal ujian medis dengan pembahasan lengkap dan AI tutor',
    icon: '📚',
    cost: 8,
    isActive: true,
    color: '#ec4899'
  },
  {
    id: 4,
    name: 'Simulasi Kasus Klinis',
    description: 'Praktikkan pengambilan keputusan klinis dengan kasus pasien virtual',
    icon: '🏥',
    cost: 12,
    isActive: true,
    color: '#f59e0b'
  },
  {
    id: 5,
    name: 'Asisten Riset Medis',
    description: 'Cari dan analisis jurnal medis dengan bantuan AI',
    icon: '🔍',
    cost: 15,
    isActive: true,
    color: '#10b981'
  },
  {
    id: 6,
    name: 'Generator Catatan SOAP',
    description: 'Buat catatan medis SOAP terstruktur dengan cepat dan akurat',
    icon: '📝',
    cost: 6,
    isActive: true,
    color: '#3b82f6'
  },
  {
    id: 7,
    name: 'Panduan Prosedur Medis',
    description: 'Akses panduan langkah demi langkah untuk prosedur medis',
    icon: '⚕️',
    cost: 7,
    isActive: true,
    color: '#ef4444'
  }
]

function Features() {
  const [features, setFeatures] = useState(FEATURES_DATA)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature)
  }

  const handleBackToList = () => {
    setSelectedFeature(null)
  }

  const handleUpdateFeature = (featureId, updates) => {
    setFeatures(features.map(f =>
      f.id === featureId ? { ...f, ...updates } : f
    ))
    // TODO: API call to update feature
  }

  if (loading) {
    return <LoadingState>Memuat fitur...</LoadingState>
  }

  const renderFeaturePage = () => {
    // Check if feature has custom subpage
    if (selectedFeature?.id === 2) {
      // Latihan Soal
      return <LatihanSoal onBack={handleBackToList} />
    }

    // Default feature config for other features
    return (
      <FeatureConfig
        feature={selectedFeature}
        onBack={handleBackToList}
        onUpdate={handleUpdateFeature}
      />
    )
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!selectedFeature ? (
        <>
          <HeaderSection>
            <SectionTitle>Kelola Fitur</SectionTitle>
          </HeaderSection>
          <FeaturesList
            features={features}
            onFeatureClick={handleFeatureClick}
          />
        </>
      ) : (
        renderFeaturePage()
      )}
    </Container>
  )
}

export default Features
