package vn.duonghai.jobportal.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.dto.request.CategoryRequest;
import vn.duonghai.jobportal.dto.response.CategoryResponse;
import vn.duonghai.jobportal.entity.Category;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.CategoryRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.service.CategoryService;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final JobPostRepository jobPostRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .sorted(Comparator.comparing(Category::getName, String.CASE_INSENSITIVE_ORDER))
                .map(CategoryResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        validateDuplicateName(request.name(), null);

        var category = new Category();
        applyCategoryData(category, request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest request) {
        var category = getCategoryOrThrow(categoryId);
        validateDuplicateName(request.name(), categoryId);
        applyCategoryData(category, request);
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        var category = getCategoryOrThrow(categoryId);
        if (categoryRepository.existsByParent_Id(categoryId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Danh muc dang co danh muc con");
        }
        if (jobPostRepository.existsByCategory_Id(categoryId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Danh muc dang duoc su dung boi tin tuyen dung");
        }
        categoryRepository.delete(category);
    }

    private void applyCategoryData(Category category, CategoryRequest request) {
        category.setName(request.name().trim());
        category.setParent(resolveParent(request.parentId(), category.getId()));
    }

    private Category resolveParent(Long parentId, Long currentCategoryId) {
        if (parentId == null) {
            return null;
        }
        if (parentId.equals(currentCategoryId)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Danh muc khong the tu tham chieu den chinh no");
        }
        return getCategoryOrThrow(parentId);
    }

    private void validateDuplicateName(String name, Long currentCategoryId) {
        var existing = categoryRepository.findByNameIgnoreCase(name.trim());
        if (existing.isPresent() && !existing.get().getId().equals(currentCategoryId)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Ten danh muc da ton tai");
        }
    }

    private Category getCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Khong tim thay danh muc"));
    }
}
