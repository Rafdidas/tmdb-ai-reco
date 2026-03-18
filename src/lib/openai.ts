import 'server-only';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY 환경변수가 없습니다.');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});