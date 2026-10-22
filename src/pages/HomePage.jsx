import { useEffect, useState } from "react";
import { getCafes } from "../api/cafeApi.js";
import useDebounce from "../hooks/useDebounce.js";
import Filters from "../components/Filters.jsx";
import CafeList from "../components/CafeList.jsx";
import Pagination from "../components/Pagination.jsx";
import { Loader, ErrorMessage, EmptyState } from "../components/Status.jsx";

const DEFAULT_FILTERS = { search: "", district: "all", type: "all", sort: "rating-desc" };

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [request, setRequest] = useState({ status: "loading", data: null, error: null });
  const search = useDebounce(filters.search, 300);

  useEffect(() => {
    const controller = new AbortController(); // prevents race conditions / stale updates
    setRequest((prev) => ({ ...prev, status: "loading", error: null }));
    getCafes({ search, district: filters.district, type: filters.type, sort: filters.sort, page }, controller.signal)
      .then((data) => setRequest({ status: "success", data, error: null }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setRequest({ status: "error", data: null, error: err.message });
      });
    return () => controller.abort(); // cleanup
  }, [search, filters.district, filters.type, filters.sort, page, reloadKey]);

  const handleFilters = (next) => {
    setFilters(next);
    setPage(1); // new filters -> back to the first page
  };

  const { status, data, error } = request;

  return (
    <>
      <h1>Find a café in Almaty</h1>
      <Filters filters={filters} onChange={handleFilters} onReset={() => handleFilters(DEFAULT_FILTERS)} />
      {status === "loading" && <Loader />}
      {status === "error" && <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />}
      {status === "success" && data.items.length === 0 && (
        <EmptyState title="No cafés match your filters">
          <p>Try a different search or reset the filters.</p>
          <button className="btn" onClick={() => handleFilters(DEFAULT_FILTERS)}>Reset filters</button>
        </EmptyState>
      )}
      {status === "success" && data.items.length > 0 && (
        <>
          <p className="muted">{data.total} cafés found</p>
          <CafeList cafes={data.items} />
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}