import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { PackageSearch, Search } from "lucide-react";
import { api } from "../lib/api";
import { PageHeader } from "../components/PageHeader";
import { AssetCard } from "../components/AssetCard";
import { BookingModal } from "../components/BookingModal";
import { Select } from "../components/ui/Field";
import { Spinner, EmptyState, ErrorState } from "../components/ui/States";
import { Pagination } from "../components/ui/Pagination";
import type { Asset, Category, Pagination as PaginationType } from "../types";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Asset | null>(null);

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await api.get<{ categories: Category[] }>("/categories")).data.categories,
  });

  const assets = useQuery({
    queryKey: ["assets", { search, categoryId, availableOnly, sort, page }],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (categoryId) params.set("categoryId", categoryId);
      if (availableOnly) params.set("availableOnly", "true");
      params.set("sort", sort);
      params.set("page", String(page));

      const res = await api.get<{ assets: Asset[]; pagination: PaginationType }>(
        `/assets?${params.toString()}`
      );

      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Assets"
        subtitle="Discover available resources and request what you need."
      />

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, description or location…"
              className="input pl-9"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
            <Select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
              className="sm:w-48"
            >
              <option value="">All categories</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-40">
              <option value="name">Sort: Name</option>
              <option value="available">Sort: Availability</option>
              <option value="newest">Sort: Newest</option>
            </Select>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => {
                  setAvailableOnly(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-300"
              />
              Available only
            </label>
          </div>
        </div>
      </div>

      {assets.isLoading ? (
        <Spinner label="Loading assets…" />
      ) : assets.isError ? (
        <ErrorState message="Failed to load assets. Is the backend running?" />
      ) : assets.data && assets.data.assets.length > 0 ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {assets.data.assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onRequest={setSelected} />
            ))}
          </div>

          <Pagination pagination={assets.data.pagination} onChange={setPage} />
        </div>
      ) : (
        <EmptyState
          icon={<PackageSearch className="h-7 w-7" />}
          title="No assets found"
          description="Try adjusting your search or filters."
        />
      )}

      {selected && (
        <BookingModal asset={selected} open={!!selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}