import { GetPrismaClient } from '..';
import { LanguageCode } from '../../generated/prisma';
import { ViolationOption } from '../types/report';

let reportViolationsCache: ViolationOption[] = [];

export async function loadViolations(): Promise<void> {
  const prisma = await GetPrismaClient();

  const violations = await prisma.violation.findMany({
    include: {
      category: true,
      description: {
        include: {
          translations: true,
        },
      },
    },
    orderBy: [
      {
        category: {
          code: 'asc',
        },
      },
      {
        code: 'asc',
      },
    ],
  });

  reportViolationsCache = violations.map((violation) => {
    const frenchDescription =
      violation.description.translations.find((t) => t.language === LanguageCode.FR)?.value ?? '';
    const englishDescription =
      violation.description.translations.find((t) => t.language === LanguageCode.EN)?.value ?? '';

    return {
      code: `V. ${violation.category.code}.${violation.code}`,
      description: {
        french: frenchDescription,
        english: englishDescription,
      },
      value: `violation-${violation.id}`,
    };
  });
}

export function getReportViolations(): ViolationOption[] {
  return reportViolationsCache;
}
