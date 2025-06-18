import { GetPrismaClient } from '..';
import { LanguageCode } from '../../generated/prisma';
import { ViolationCategoryOption } from '../types/violation';

let violationCategoriesCache: ViolationCategoryOption[] = [];

export async function loadViolationCategories(): Promise<void> {
  const prisma = await GetPrismaClient();

  const violationCategories = await prisma.violationCategory.findMany({
    include: {
      meaning: {
        include: {
          translations: true,
        },
      },
    },
    orderBy: {
      code: 'asc',
    },
  });

  violationCategoriesCache = violationCategories.map((category) => {
    const frenchMeaning =
      category.meaning.translations.find((t) => t.language === LanguageCode.FR)?.value ?? '';
    const englishMeaning =
      category.meaning.translations.find((t) => t.language === LanguageCode.EN)?.value ?? '';

    return {
      code: `VC.${category.code}`,
      meaning: {
        french: frenchMeaning,
        english: englishMeaning,
      },
      value: `violation-category-${category.id}`,
    };
  });
}

export function getViolationCategories(): ViolationCategoryOption[] {
  return violationCategoriesCache;
}
