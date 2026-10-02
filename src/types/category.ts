export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  level: 1 | 2 | 3;
  sort_order: number;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}
