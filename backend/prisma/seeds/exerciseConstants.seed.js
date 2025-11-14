import prisma from '../client.js'

export async function seedExerciseConstants() {
  console.log('Seeding exercise constants...')

  const constants = [
    {
      key: 'exercise_feature_title',
      value: 'Latihan Soal Fill-in-the-Blank'
    },
    {
      key: 'exercise_feature_description',
      value: 'Generate soal latihan dengan format fill-in-the-blank untuk membantu mahasiswa kedokteran belajar lebih efektif'
    },
    {
      key: 'exercise_generation_model',
      value: 'gemini-1.5-flash'
    },
    {
      key: 'exercise_generation_prompt',
      value: `Anda adalah asisten AI untuk membuat soal latihan kedokteran dengan format fill-in-the-blank.

Berdasarkan konteks materi berikut:
{{context}}

Buatlah {{numberOfQuestions}} soal latihan dalam format fill-in-the-blank dengan kriteria:
1. Gunakan ____ sebagai placeholder untuk kata yang harus diisi
2. Fokus pada konsep penting, terminologi medis, dan fakta kunci
3. Setiap soal harus jelas dan tidak ambigu
4. Berikan penjelasan singkat untuk setiap jawaban
5. Soal harus relevan dengan konteks materi yang diberikan

Format output JSON:
[
  {
    "question": "Teks soal dengan ____ sebagai blank",
    "answer": "Jawaban yang tepat",
    "explanation": "Penjelasan singkat mengapa ini adalah jawaban yang benar"
  }
]

Pastikan output adalah valid JSON array.`
    },
    {
      key: 'exercise_credit_cost',
      value: '10'
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

  console.log('Exercise constants seeding completed!')
}

// Run if called directly
seedExerciseConstants()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error seeding exercise constants:', error)
    process.exit(1)
  })
if (import.meta.url === `file://${process.argv[1]}`) {
}
