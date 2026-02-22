import { useState, useEffect, useMemo } from 'react';

import { Line, Column, Pie } from '@ant-design/plots';
import { Card, Statistic, Table, Tag } from 'antd';
import dayjs from 'dayjs';

import { dashboardService } from '@/services/dashboard';
import type { DashboardStats } from '~/types/dashboard';

export default function Data() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const initDashboardStats = async () => {
    const res = await dashboardService.getDashboardStats();
    setDashboardStats(res.data);
  };

  useEffect(() => {
    initDashboardStats();
  }, []);

  const trendLineData = useMemo(() => {
    if (!dashboardStats?.trend7d) return [];
    return dashboardStats.trend7d.flatMap(item => {
      const date = item.date?.slice(0, 10);
      return [
        {
          date,
          type: 'PV',
          value: item.pv,
        },
        {
          date,
          type: 'UV',
          value: item.uv,
        },
      ];
    });
  }, [dashboardStats]);

  const visitorColumns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      return: (value: string) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: 'UserAgent',
      dataIndex: 'userAgent',
      render: (value: string) => (
        <p className="text-sm max-w-[100px] truncate" title={value}>
          {value}
        </p>
      ),
    },
    {
      title: '访问时间',
      dataIndex: 'visitedAt',
      render: (value: string) => (
        <p className="text-sm max-w-[100px] truncate" title={dayjs(value).format('YYYY-MM-DD')}>
          {dayjs(value).format('YYYY-MM-DD')}
        </p>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <Card>
          <Statistic title="当前在线人数" value={dashboardStats?.today?.pv} suffix="人" />
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">
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
            legend={{
              position: 'right',
            }}
            label={{
              type: 'inner',
              offset: '-30%',
              content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
              style: { fontSize: 12, textAlign: 'center' },
            }}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">
        <Card title="文章分类浏览量" className="xl:col-span-2" bodyStyle={{ height: 320 }}>
          <Column data={dashboardStats?.categoryViews} />
        </Card>
        <Card title="实时访客列表" bodyStyle={{ padding: 0 }}>
          <Table
            size="small"
            columns={visitorColumns}
            dataSource={dashboardStats?.recentVisitors ?? []}
            rowKey="id"
            pagination={false}
            scroll={{ y: 35 * 7 }}
          />
        </Card>
      </div>
    </div>
  );
}
