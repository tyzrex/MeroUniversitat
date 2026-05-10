"use server";

import { searchUniversities } from "@/modules/community/services/university.service";

export async function searchUniversitiesAction(query: string, limit = 50) {
  return searchUniversities({ query, limit });
}
