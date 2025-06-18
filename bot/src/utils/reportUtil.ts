import { GetPrismaClient } from '..';
import { LanguageCode } from '../../generated/prisma';
import { ReportReason } from '../types/report';

let reportViolationsCache: ReportReason[] = [];

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
  });

  reportViolationsCache = violations.map((violation) => {
    const fr =
      violation.description.translations.find((t) => t.language === LanguageCode.FR)?.value ?? '';
    const en =
      violation.description.translations.find((t) => t.language === LanguageCode.EN)?.value ?? '';

    return {
      code: `V. ${violation.category.code}.${violation.code}`,
      description: {
        french: fr,
        english: en,
      },
      value: `violation-${violation.id}`,
    };
  });
}

export function getReportViolations(): ReportReason[] {
  return reportViolationsCache;
}
