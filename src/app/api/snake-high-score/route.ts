import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const highScoreFilePath = path.join(process.cwd(), "src", "datas", "SnakeHighScore.json");

function readHighScore(): number {
  try {
    const data = fs.readFileSync(highScoreFilePath, "utf-8");
    const json = JSON.parse(data);
    return json.highScore || 0;
  } catch {
    return 0;
  }
}

function writeHighScore(score: number): void {
  fs.writeFileSync(highScoreFilePath, JSON.stringify({ highScore: score }, null, 2));
}

export async function GET() {
  const highScore = readHighScore();
  return NextResponse.json({ highScore });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newScore = body.score || 0;
  
  const currentHighScore = readHighScore();
  
  if (newScore > currentHighScore) {
    writeHighScore(newScore);
    return NextResponse.json({ highScore: newScore, isNewHighScore: true });
  }
  
  return NextResponse.json({ highScore: currentHighScore, isNewHighScore: false });
}