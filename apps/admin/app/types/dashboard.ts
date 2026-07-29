export interface DashboardToday {
  pv: number;
  uv: number;
}

export interface DashboardTotals {
  posts: number;
  comments: number;
}

export interface DashboardTrendPoint {
  date: string;
  pv: number;
  uv: number;
}

export interface DashboardSourceRatioItem {
  source: string;
  value: number;
}

export interface DashboardCategoryViewsItem {
  categoryId: number;
  name: string;
  views: number;
}

export interface DashboardStats {
  today: DashboardToday;
  totals: DashboardTotals;
  trend7d: DashboardTrendPoint[];
  sourceRatio: DashboardSourceRatioItem[];
  categoryViews: DashboardCategoryViewsItem[];
}
