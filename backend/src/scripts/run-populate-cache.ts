import { makePopulateFixedCryptoCacheUseCase } from '@/use-cases/factories/make-populate-fixed-crypto-cache-use-case'
import { prisma } from '@/lib/prisma'

async function main() {
  console.log(
    '[Render Cron Job] Starting execution of PopulateFixedCryptoCacheUseCase...',
  )

  try {
    await prisma.$connect()
    console.log('[Render Cron Job] Prisma connected.')

    const populateUseCase = makePopulateFixedCryptoCacheUseCase()
    await populateUseCase.execute()

    console.log(
      '[Render Cron Job] PopulateFixedCryptoCacheUseCase successfully executed.',
    )
  } catch (error) {
    console.error(
      '[Render Cron Job] Error executing PopulateFixedCryptoCacheUseCase:',
      error,
    )
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('[Render Cron Job] Prisma disconnected.')
  }
}

main()
