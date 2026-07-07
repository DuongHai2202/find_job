package vn.duonghai.jobportal.service;

import vn.duonghai.jobportal.dto.request.CategoryRequest;
import vn.duonghai.jobportal.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAllCategories();

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(Long categoryId, CategoryRequest request);

    void deleteCategory(Long categoryId);
}
