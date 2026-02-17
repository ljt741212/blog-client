/** 与后端 ChangelogType 枚举一致 */
export type ChangelogType = 'feature' | 'improvement' | 'bugfix' | 'security';

export interface Changelog {
  id: number;
  version: string;
  title: string;
  content: string;
  type: ChangelogType;
  isPublished: boolean;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
}
