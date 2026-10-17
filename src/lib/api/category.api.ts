import { CategoryService } from "@/services/CategoryService";
import { Category, CreateCategoryPayload } from "@/types/category";

export const CategoryApi = {
  getPublicCategories: async (): Promise<Category[]> => {
    const res = await CategoryService.getCategories({ page: 1, limit: 100 });
    return res.categories;
  },

  createAdminCategory: async (dto: CreateCategoryPayload): Promise<Category> => {
    return CategoryService.createCategory(dto);
  },
};

export default CategoryApi;
