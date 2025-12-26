import prisma from '#client'

export async function seedFeatures() {
  console.log('🌱 Seeding features...')

  const features = [
      'Asisten Diagnosis AI',
      'Latihan Soal',
      'Flashcard Belajar',
      'Analisis Laporan Lab',
      'Pencarian Literatur Medis',
      'Penilaian Risiko Genetik',
      'Generator Rencana Perawatan',
      'Penilaian Risiko Genetik 2',
  ]

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { name: feature },
      update: {
        isActive: true
      },
      create: {
        name: feature
      }
    })
  }

  console.log('✅ Features seeded successfully')
}