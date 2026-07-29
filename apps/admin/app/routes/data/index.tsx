import { useEffect, useMemo, useState } from 'react';

import { Line, Column, Pie } from '@ant-design/plots';
import { Button, Card, DatePicker, Input, Space, Statistic, Table, Tag, message } from 'antd';
import dayjs from 'dayjs';

import { dashboardService } from '@/services/dashboard';
import { visitorService } from '@/services/visitor';

import type { PaginationResponse } from '~/types';
import type { DashboardStats } from '~/types/dashboard';
import type { Visitor } from '~/types/visitor';

import type { TablePaginationConfig } from 'antd/es/table';

const visitorColumns = [
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 140,
    render: (value: string) => <Tag color="blue">{value}</Tag>,
  },
  {
    title: '位置',
    dataIndex: 'location',
    width: 100,
    render: (value: string | null) => (
      <p className="text-sm truncate max-w-[80px]" title={value ?? undefined}>
        {value ?? '-'}
      </p>
    ),
  },
  {
    title: 'UA',
    dataIndex: 'userAgent',
    width: 140,
    render: (value: string | null) => (
      <p className="text-sm truncate max-w-[120px]" title={value ?? undefined}>
        {value ?? '-'}
      </p>
    ),
  },
  {
    title: '最后活跃',
    dataIndex: 'lastActiveAt',
    width: 130,
    render: (value: string) => (
      <p className="text-sm" title={dayjs(value).format('YYYY-MM-DD HH:mm:ss')}>
        {dayjs(value).format('MM-DD HH:mm')}
      </p>
    ),
  },
];

export default function Data() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [onlineVisitors, setOnlineVisitors] = useState<number>(0);
  const [visitorPage, setVisitorPage] = useState<PaginationResponse<Visitor> | null>(null);
  const [visitorLoading, setVisitorLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const loadVisitors = async (page = 1, pageSize = 10, params?: Record<string, string>) => {
    setVisitorLoading(true);
    const res = await visitorService
      .getVisitorPage({ current: page, pageSize, ...(params ?? filters) })
      .finally(() => setVisitorLoading(false));
    setVisitorPage(res.data);
  };

  useEffect(() => {
    dashboardService.getDashboardStats().then(res => setDashboardStats(res.data));
    loadVisitors();

    const controller = new AbortController();
    visitorService.connectOnlineStream({
      signal: controller.signal,
      onmessage: event => {
        if (event.data) {
          const { count } = JSON.parse(event.data).data;
          setOnlineVisitors(count);
        }
      },
      onerror: err => {
        message.error('获取在线访客失败:' + err.message);
        return 5000;
      },
    });
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trendLineData = useMemo(() => {
    if (!dashboardStats?.trend7d) return [];
    return dashboardStats.trend7d.flatMap(item => {
      const date = item.date?.slice(0, 10);
      return [
        { date, type: 'PV', value: item.pv },
        { date, type: 'UV', value: item.uv },
      ];
    });
  }, [dashboardStats]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    loadVisitors(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const handleSearch = () => loadVisitors(1, visitorPage?.meta.pageSize, filters);

  const handleReset = () => {
    setFilters({});
    loadVisitors(1, visitorPage?.meta.pageSize, {});
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <Card>
          <Statistic title="当前在线人数" value={onlineVisitors} suffix="人" />
        </Card>
        <Card>
          <Statistic title="今日访问量 (PV)" value={dashboardStats?.today?.pv} suffix="次" />
        </Card>
        <Card>
          <Statistic title="今日独立访客 (UV)" value={dashboardStats?.today?.uv} suffix="人" />
        </Card>
        <Card>
          <Statistic title="文章总数" value={dashboardStats?.totals?.posts} suffix="篇" />
        </Card>
        <Card>
          <Statistic title="评论总数" value={dashboardStats?.totals?.comments} suffix="条" />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="近 7 日访问趋势" className="xl:col-span-2" bodyStyle={{ height: 320 }}>
          <Line data={trendLineData} xField="date" yField="value" seriesField="type" smooth />
        </Card>
        <Card title="访问来源占比" bodyStyle={{ height: 320 }}>
          <Pie
            height={260}
            radius={0.8}
            data={dashboardStats?.sourceRatio || []}
            angleField="value"
            colorField="source"
            legend={{ position: 'right' }}
            label={{
              text: (d: Record<string, unknown>) => {
                const total = (dashboardStats?.sourceRatio || []).reduce(
                  (sum, item) => sum + (Number(item.value) || 0),
                  0
                );
                const pct = total > 0 ? ((Number(d.value) || 0) / total) * 100 : 0;
                return `${pct.toFixed(0)}%`;
              },
              position: 'inside',
              style: { fontSize: 12, textAlign: 'center' },
            }}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="文章分类浏览量" bodyStyle={{ height: 320 }}>
          <Column data={dashboardStats?.categoryViews} xField="name" yField="views" />
        </Card>
        <Card title="实时访客列表" bodyStyle={{ padding: 0 }}>
          <div className="px-4 pt-3 pb-2">
            <Space>
              <Input
                placeholder="IP"
                value={filters.ip ?? ''}
                onChange={e => setFilters(p => ({ ...p, ip: e.target.value }))}
                style={{ width: 140 }}
                allowClear
              />
              <Input
                placeholder="位置"
                value={filters.location ?? ''}
                onChange={e => setFilters(p => ({ ...p, location: e.target.value }))}
                style={{ width: 120 }}
                allowClear
              />
              <DatePicker.RangePicker
                value={
                  filters.startTime && filters.endTime
                    ? [dayjs(filters.startTime), dayjs(filters.endTime)]
                    : null
                }
                onChange={(_, [start, end]) =>
                  setFilters(p => {
                    const { startTime: _st, endTime: _et, ...rest } = p;
                    return start && end ? { ...rest, startTime: start, endTime: end } : rest;
                  })
                }
              />
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </div>
          <Table
            size="small"
            columns={visitorColumns}
            dataSource={visitorPage?.items ?? []}
            rowKey="id"
            loading={visitorLoading}
            pagination={{
              ...visitorPage?.meta,
              showSizeChanger: true,
              showTotal: (total: number) => `共 ${total} 人`,
            }}
            onChange={handleTableChange}
            scroll={{ y: 260 }}
          />
        </Card>
      </div>
    </div>
  );
}
