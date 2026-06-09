'use client';

import { useState, useEffect } from 'react';

import { Pagination, Input } from 'antd';

import { Card } from '@/components/article';
import { getArticles, getArticleCategories } from '@/lib/api';
import type { Article } from '@/types/article';

import Footer from './components/footer';

import type { Category } from './types/category';

const { Search } = Input;

export default function Home() {
  const [articles, setArticle] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [pagInfo, setPagInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchArticles = async (
    current: number = 1,
    pageSize: number = 10,
    overrides?: { categoryId?: number; searchValue?: string }
  ) => {
    const cid = overrides && 'categoryId' in overrides ? overrides.categoryId : categoryId;
    const keyword = overrides && 'searchValue' in overrides ? overrides.searchValue : searchValue;
    const data = await getArticles({
      searchValue: keyword || undefined,
      categoryId: cid,
      current,
      pageSize,
    });
    const { items, meta } = data;
    setArticle(items);
    setPagInfo(meta);
  };

  const fetchCategories = async () => {
    const data = await getArticleCategories();
    setCategories(data);
  };

  useEffect(() => {
    Promise.all([fetchArticles(), fetchCategories()]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex gap-12 p-32 pt-18 bg-[var(--page-bg)] max-w-full overflow-x-hidden">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex-1 flex flex-col gap-8">
            {articles.map(item => (
              <Card key={item.id} data={item} />
            ))}
          </div>

          <Pagination className="mt-8 dark-pagination" {...pagInfo} onChange={fetchArticles} />
        </div>
        <div className="flex w-80 flex-col gap-8">
          <div
            className="rounded-2xl p-6 border backdrop-blur-md bg-[var(--background-secondary)] border-[var(--border-primary)]"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <Search
              placeholder="文章搜索"
              size="large"
              onSearch={value => {
                setCategoryId(undefined);
                fetchArticles(1, 10, { searchValue: value, categoryId: undefined });
              }}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
          <div
            className="rounded-2xl px-6 py-4 flex flex-col gap-3 border backdrop-blur-md bg-[var(--background-secondary)] border-[var(--border-primary)]"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">文章分类</h3>
            <ul className="category-scroll flex flex-col gap-2 max-h-64 overflow-y-auto">
              <li
                className={`h-8 px-2 flex items-center justify-between rounded-md cursor-pointer transition-colors duration-200 hover:bg-[var(--background)] hover:text-[var(--primary)] ${
                  categoryId === undefined
                    ? 'bg-[var(--background)] text-[var(--primary)] font-medium'
                    : ''
                }`}
                onClick={() => {
                  setCategoryId(undefined);
                  fetchArticles(1, 10, { categoryId: undefined });
                }}
              >
                全部
              </li>
              {categories.map(item => (
                <li
                  key={item.id}
                  className={`h-8 px-2 flex items-center justify-between rounded-md cursor-pointer transition-colors duration-200 hover:bg-[var(--background)] hover:text-[var(--primary)] ${
                    categoryId === item.id
                      ? 'bg-[var(--background)] text-[var(--primary)] font-medium'
                      : ''
                  }`}
                  onClick={() => {
                    const newId = categoryId === item.id ? undefined : item.id;
                    setCategoryId(newId);
                    fetchArticles(1, 10, { categoryId: newId });
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
