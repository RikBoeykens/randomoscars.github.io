import { OscarCategory, OscarYear } from './Models';
import uniq from 'ramda/src/uniq';

async function getOscarCategories(ceremonyNum: number): Promise<OscarYear> {
  const fileResponse = await fetch(`/Data/${ceremonyNum}.json`);
  const storedCategories: Array<OscarCategory & { year?: number }> =
    await fileResponse.json();
  const year = ceremonyNum + 1928;
  return storedCategories.map((category) => {
    category.year = year;
    return category;
  });
}

export async function getAllCategories(): Promise<string[]> {
  let categories: string[] = [];
  for (let i = 1; i <= 93; i++) {
    const oscarCategories = await getOscarCategories(i);
    categories = categories.concat(
      oscarCategories.map((category) => category.name)
    );
  }
  return uniq(categories).sort();
}

export async function getAwardData(
  categoryName: string,
  year: number
): Promise<OscarCategory | undefined> {
  const ceremonyNum = year - 1928;
  const oscarCategories = await getOscarCategories(ceremonyNum);
  return oscarCategories.find((category) => category.name === categoryName);
}

export async function randomize() {
  const ceremonyNum = Math.floor(Math.random() * 92) + 1;
  const oscarCategories = await getOscarCategories(ceremonyNum);
  const index = Math.floor(Math.random() * oscarCategories.length);
  const categoryName = oscarCategories[index].name;
  return [categoryName, ceremonyNum + 1928] as const;
}
