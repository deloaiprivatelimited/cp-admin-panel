export interface SampleIO {
  input_text: string;
  output: string;
  explanation: string;
}

export interface Author {
  email: string;
  exp: number;
  id: string;
}

export interface Question {
  id: string;
  title: string;
  topic: string;
  subtopic?: string;
  tags: string[];
  short_description: string;
  long_description_markdown: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  time_limit_ms: number;
  memory_limit_kb: number;
  allowed_languages: string[];
  predefined_boilerplates?: Record<string, string>;
  solution_code?: Record<string, string>;
  run_code_enabled: boolean;
  submission_enabled: boolean;
  sample_io: SampleIO[];
  authors: Author[];
  created_at: string;
  updated_at: string;
  version: number;
}

export interface TestResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}