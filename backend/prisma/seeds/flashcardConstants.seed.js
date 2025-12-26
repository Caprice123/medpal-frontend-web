import prisma from '#client'

export async function seedFlashcardConstants() {
  console.log('Seeding flashcard constants...')

  const constants = [
    {
      key: 'flashcard_feature_title',
      value: 'Flashcard Belajar Interaktif'
    },
    {
      key: 'flashcard_feature_description',
      value: 'Generate flashcard untuk membantu mahasiswa kedokteran menghafal konsep penting dengan metode active recall'
    },
    {
      key: 'flashcard_generation_model',
      value: 'gemini-2.5-flash'
    },
    {
      key: 'flashcard_generation_prompt',
      value: `Kamu adalah seorang dosen medis yang ahli dalam membuat flashcard untuk mahasiswa kedokteran.

Tugas: Buatlah {{cardCount}} flashcard berkualitas tinggi berdasarkan materi berikut.

Materi:
{{context}}

Format Output (JSON):
[
  {
    "front": "Pertanyaan atau istilah medis",
    "back": "Jawaban singkat"
  }
]

Aturan:
1. Front card: Tulis pertanyaan singkat ATAU istilah medis penting
2. Back card: Tulis jawaban SINGKAT (1-5 kata atau frase pendek)
3. Fokus pada konsep medis penting dari materi
4. Jawaban harus RINGKAS dan TO THE POINT (bukan kalimat panjang)
5. Contoh jawaban yang baik: "4 ruang", "Atrium dan Ventrikel", "Miokardium", "O2 dan CO2"
6. HINDARI jawaban panjang atau penjelasan detail
7. Gunakan bahasa Indonesia yang formal dan medis
8. Pastikan flashcard bervariasi dan mencakup berbagai aspek materi
9. Output harus berupa valid JSON array

Hasilkan HANYA JSON array tanpa teks tambahan apapun.`
    },
    {
      key: 'flashcard_credit_cost',
      value: '10'
    },
    {
      key: 'flashcard_session_type',
      value: 'flashcard'
    }
  ]

  for (const constant of constants) {
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: { value: constant.value },
      create: constant
    })
    console.log(`✓ Seeded constant: ${constant.key}`)
  }

  console.log('Flashcard constants seeding completed!')
}

// Run if called directly
// if (import.meta.url === `file://${process.argv[1]}`) {
  seedFlashcardConstants()
    .then(async () => {
      console.log('Done!')
      await prisma.$disconnect()
      process.exit(0)
    })
    .catch(async (error) => {
      console.error('Error seeding flashcard constants:', error)
      await prisma.$disconnect()
      process.exit(1)
    })
// }
