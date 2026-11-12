import { useState } from "react";
import { useCafes } from "../hooks/useCafes.js";
import useDebounce from "../hooks/useDebounce.js";
import Filters from "../components/Filters.jsx";
import CafeList from "../components/CafeList.jsx";
import Pagination from "../components/Pagination.jsx";
import { Loader, ErrorMessage, EmptyState } from "../components/Status.jsx";

const DEFAULT_FILTERS = { search: "", district: "all", type: "all", sort: "rating-desc" };

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const search = useDebounce(filters.search, 300);

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useCafes({
    search,
    district: filters.district,
    type: filters.type,
    sort: filters.sort,
    page,
  });

  const handleFilters = (next) => {
    setFilters(next);
    setPage(1); // новые фильтры -> первая страница
  };

  return (
    <>
      <h1>Find a café in Almaty</h1>
      <Filters filters={filters} onChange={handleFilters} onReset={() => handleFilters(DEFAULT_FILTERS)} />

      {isError && <ErrorMessage message={error.message} onRetry={() => refetch()} />}
      {!isError && isPending && <Loader />}

      {!isError && data && data.items.length === 0 && (
        <EmptyState title="No cafés match your filters">
          <p>Try a different search or reset the filters.</p>
          <button className="btn" onClick={() => handleFilters(DEFAULT_FILTERS)}>Reset filters</button>
        </EmptyState>
      )}

      {!isError && data && data.items.length > 0 && (
        <div style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
          <p className="muted">{data.total} cafés found</p>
          <CafeList cafes={data.items} />
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </div>
      )}
    </>
  );
}