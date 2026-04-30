import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PracticeTest from '@/models/PracticeTest';
import { verifyDevAuth, unauthorized } from '@/lib/devAuth';

// CSV Import endpoint for practice test questions
// Expected CSV format: question,optionA,optionB,optionC,optionD,correctAnswer,explanation
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyDevAuth(request)) return unauthorized();
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { csvData } = body; // Array of rows or raw CSV string

    let questions: any[] = [];

    if (typeof csvData === 'string') {
      // Parse raw CSV string
      const lines = csvData.split('\n').filter((l: string) => l.trim());
      // Skip header if first line contains 'question'
      const startIdx = lines[0]?.toLowerCase().includes('question') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length >= 6) {
          questions.push({
            question: cols[0].trim(),
            options: [cols[1].trim(), cols[2].trim(), cols[3].trim(), cols[4].trim()],
            correctAnswer: parseInt(cols[5].trim()),
            explanation: cols[6]?.trim() || '',
          });
        }
      }
    } else if (Array.isArray(csvData)) {
      // Already parsed array of question objects
      questions = csvData;
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No valid questions found in CSV data' }, { status: 400 });
    }

    // Find the test and append questions
    const test = await PracticeTest.findOne({ testId: id });
    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    test.questions.push(...questions);
    test.questionsCount = test.questions.length;
    await test.save();

    return NextResponse.json({
      success: true,
      imported: questions.length,
      totalQuestions: test.questions.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Simple CSV line parser that handles quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
