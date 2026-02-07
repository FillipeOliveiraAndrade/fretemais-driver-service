import { apiRequest, type PageResponse } from "@/lib/api";

export type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  vehicleTypes: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DriverPayload = {
  name: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  vehicleTypes: string[];
};

export type DriverFilters = {
  text: string;
  city: string;
  state: string;
  vehicleTypes: string[];
};

export const VEHICLE_TYPES = [
  "VAN",
  "TOCO",
  "BAU",
  "SIDER",
  "TRUCK",
  "BITRUCK",
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const SORT_OPTIONS = [
  { label: "Mais recentes", value: "CREATED_AT_DESC" },
  { label: "Nome (A-Z)", value: "NAME_ASC" },
  { label: "Nome (Z-A)", value: "NAME_DESC" },
  { label: "Atualizado recentemente", value: "UPDATED_AT_DESC" },
] as const;

export type DriverSortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: DriverSortValue = "CREATED_AT_DESC";
export const PAGE_SIZE_OPTIONS = [5, 10] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSizeOption = 5;

export const EMPTY_FILTERS: DriverFilters = {
  text: "",
  city: "",
  state: "",
  vehicleTypes: [],
};

type SearchParamsLike = {
  get: (name: string) => string | null;
  getAll: (name: string) => string[];
};

export function parseDriverSearchParams(params: SearchParamsLike) {
  const rawVehicleTypes = params.getAll("vehicleTypes");
  const vehicleTypes = rawVehicleTypes.filter((type) =>
    VEHICLE_TYPES.includes(type as VehicleType)
  );

  const rawSort = params.get("sort") ?? DEFAULT_SORT;
  const sortValue = SORT_OPTIONS.some((option) => option.value === rawSort)
    ? (rawSort as DriverSortValue)
    : DEFAULT_SORT;

  const rawPage = Number.parseInt(params.get("page") ?? "0", 10);
  const page = Number.isNaN(rawPage) || rawPage < 0 ? 0 : rawPage;

  const rawSize = Number.parseInt(
    params.get("size") ?? String(DEFAULT_PAGE_SIZE),
    10
  );
  const pageSize = PAGE_SIZE_OPTIONS.includes(rawSize as PageSizeOption)
    ? (rawSize as PageSizeOption)
    : DEFAULT_PAGE_SIZE;

  return {
    filters: {
      text: params.get("text") ?? "",
      city: params.get("city") ?? "",
      state: params.get("state") ?? "",
      vehicleTypes,
    },
    page,
    pageSize,
    sortValue,
    success: params.get("success") ?? "",
  };
}

export function buildDriverSearchParams(
  filters: DriverFilters,
  page: number,
  sortValue: DriverSortValue,
  pageSize: PageSizeOption
) {
  const params = new URLSearchParams();

  if (filters.text.trim()) {
    params.set("text", filters.text.trim());
  }
  if (filters.city.trim()) {
    params.set("city", filters.city.trim());
  }
  if (filters.state.trim()) {
    params.set("state", filters.state.trim());
  }
  filters.vehicleTypes.forEach((type) => params.append("vehicleTypes", type));

  if (page > 0) {
    params.set("page", String(page));
  }

  if (pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("size", String(pageSize));
  }

  if (sortValue !== DEFAULT_SORT) {
    params.set("sort", sortValue);
  }

  return params;
}

const resolveSortParams = (value: DriverSortValue) => {
  switch (value) {
    case "NAME_ASC":
      return { sortBy: "NAME", sortDir: "ASC" };
    case "NAME_DESC":
      return { sortBy: "NAME", sortDir: "DESC" };
    case "UPDATED_AT_DESC":
      return { sortBy: "UPDATED_AT", sortDir: "DESC" };
    default:
      return { sortBy: "CREATED_AT", sortDir: "DESC" };
  }
};

export async function fetchDrivers(
  filters: DriverFilters,
  page: number,
  sortValue: DriverSortValue,
  pageSize: PageSizeOption
) {
  const { sortBy, sortDir } = resolveSortParams(sortValue);
  const params = new URLSearchParams();

  if (filters.text.trim()) {
    params.set("text", filters.text.trim());
  }
  if (filters.city.trim()) {
    params.set("city", filters.city.trim());
  }
  if (filters.state.trim()) {
    params.set("state", filters.state.trim());
  }
  filters.vehicleTypes.forEach((type) => params.append("vehicleTypes", type));

  params.set("page", String(page));
  params.set("size", String(pageSize));
  params.set("sortBy", sortBy);
  params.set("sortDir", sortDir);

  return apiRequest<PageResponse<Driver>>(`/drivers?${params.toString()}`, {
    cache: "no-store",
  });
}

export function fetchDriver(id: string) {
  return apiRequest<Driver>(`/drivers/${id}`, { cache: "no-store" });
}

export function createDriver(payload: DriverPayload) {
  return apiRequest<Driver>("/drivers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDriver(id: string, payload: DriverPayload) {
  return apiRequest<Driver>(`/drivers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteDriver(id: string) {
  return apiRequest<void>(`/drivers/${id}`, {
    method: "DELETE",
  });
}
