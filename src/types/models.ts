// Domain models
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface TestEntity {
  id: number;
  name: string;
  createdAt: string;
}

// TODO: Add models later