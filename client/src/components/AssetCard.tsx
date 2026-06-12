import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, MapPin } from "lucide-react";
import { AssetStatusBadge } from "./StatusBadge";
import { Button } from "./ui/Button";
import type { Asset } from "../types";

function getCategoryName(asset: Asset) {
  const category = asset.category as unknown;

  if (typeof category === "string") return category;
  if (category && typeof category === "object" && "name" in category) {
    return String((category as { name?: string }).name || "Uncategorized");
  }

  return "Uncategorized";
}

export function AssetCard({
  asset,
  onRequest,
}: {
  asset: Asset;
  onRequest: (asset: Asset) => void;
}) {
  const [imageError, setImageError] = useState(false);

  const available = useMemo(
    () => asset.availableQuantity > 0 && asset.status === "AVAILABLE",
    [asset.availableQuantity, asset.status]
  );

  const categoryName = getCategoryName(asset);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
      <Link to={`/assets/${asset.id}`} className="block">
        <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 p-4">
          {!imageError && asset.imageUrl ? (
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Boxes className="h-14 w-14 text-slate-300" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="absolute right-3 top-3">
            <AssetStatusBadge status={asset.status} />
          </div>

          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
            {categoryName}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/assets/${asset.id}`}>
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900 transition group-hover:text-brand-700">
            {asset.name}
          </h3>
        </Link>

        {asset.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {asset.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {asset.location ?? "—"}
          </span>

          <span>
            <span
              className={`font-semibold ${
                available ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {asset.availableQuantity}
            </span>{" "}
            / {asset.totalQuantity} available
          </span>
        </div>

        <div className="mt-4">
          <Button
            size="sm"
            className="w-full rounded-2xl"
            disabled={!available}
            onClick={() => onRequest(asset)}
          >
            {available ? "Request booking" : "Unavailable"}
          </Button>
        </div>
      </div>
    </div>
  );
}