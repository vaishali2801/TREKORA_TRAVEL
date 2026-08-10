/**
 * Builds a pagination metadata object from query params.
 */
const paginate = (page, limit, total) => {
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
  const totalPages = total === 0 ? 0 : Math.ceil(total / perPage);

  return {
    page: currentPage,
    limit: perPage,
    total,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export default paginate;
