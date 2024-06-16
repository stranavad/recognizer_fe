export interface Exam {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string
  deletedAt: string | null;
}

export interface Group {
  id: number;
  name: string;
  examId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null
}

export interface Item {
  id: number;
  name: string;
  image: string;
  examId: number;
  groupId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
