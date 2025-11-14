import { seedFeatures } from './seeds/features.seed.js'

async function main() {
  console.log('🚀 Starting database seeding...\n')

  try {
    // Run feature seeder
    await seedFeatures()

    console.log('\n✨ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    const { default: prisma } = await import('../prisma/client.js')
    await prisma.$disconnect()
  })
