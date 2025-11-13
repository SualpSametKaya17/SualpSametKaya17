import { NextRequest, NextResponse } from "next/server";
import { getDatabaseStructure, executeQuery } from "@/lib/mysql";
import {
  generateResponse,
  generateSQLQuery,
  analyzeDataAndCreateReport,
  Message,
} from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, database, history } = body;

    if (!message || !database) {
      return NextResponse.json(
        { error: "Mesaj ve veritabanı bilgisi gerekli" },
        { status: 400 }
      );
    }

    // Get database config from request or session
    // Note: In production, you should securely store and retrieve this
    const dbConfigString =
      request.cookies.get("dbConfig")?.value ||
      (typeof window !== "undefined"
        ? localStorage.getItem("dbConfig")
        : null);

    if (!dbConfigString) {
      return NextResponse.json(
        { error: "Veritabanı bağlantı bilgisi bulunamadı" },
        { status: 400 }
      );
    }

    // For now, we'll expect the config to be sent from client
    // This is a simplified approach - in production use secure session management
    const dbConfig = JSON.parse(
      Buffer.from(body.dbConfig || "", "base64").toString()
    );

    dbConfig.database = database;

    // Get database structure
    const databaseStructure = await getDatabaseStructure(dbConfig);

    // Check if user is asking for a report or SQL query
    const lowerMessage = message.toLowerCase();
    const isReportRequest =
      lowerMessage.includes("rapor") ||
      lowerMessage.includes("analiz") ||
      lowerMessage.includes("özet");

    const isSQLRequest =
      lowerMessage.includes("sql") ||
      lowerMessage.includes("sorgu") ||
      lowerMessage.includes("listele") ||
      lowerMessage.includes("göster") ||
      lowerMessage.includes("bul") ||
      lowerMessage.includes("kaç");

    let response = "";

    if (isSQLRequest || isReportRequest) {
      try {
        // Generate SQL query
        const sqlQuery = await generateSQLQuery(message, databaseStructure);

        // Extract actual SQL from potential markdown code blocks
        const sqlMatch =
          sqlQuery.match(/```sql\n([\s\S]*?)\n```/) ||
          sqlQuery.match(/```\n([\s\S]*?)\n```/);
        const cleanSQL = sqlMatch ? sqlMatch[1].trim() : sqlQuery.trim();

        // Execute query
        const queryResult = await executeQuery(dbConfig, cleanSQL);

        if (queryResult.success && queryResult.results) {
          if (isReportRequest) {
            // Generate detailed report
            response = await analyzeDataAndCreateReport(
              queryResult.results,
              message
            );
          } else {
            // Return SQL query and results summary
            response = `**Çalıştırılan SQL Sorgusu:**\n\`\`\`sql\n${cleanSQL}\n\`\`\`\n\n`;
            response += `**Sonuçlar:** ${queryResult.results.length} kayıt bulundu.\n\n`;

            if (queryResult.results.length > 0) {
              response += `**İlk 5 Kayıt:**\n\`\`\`json\n${JSON.stringify(
                queryResult.results.slice(0, 5),
                null,
                2
              )}\n\`\`\`\n\n`;
            }

            // Add AI analysis
            const aiAnalysis = await analyzeDataAndCreateReport(
              queryResult.results,
              message
            );
            response += `\n**Analiz:**\n${aiAnalysis}`;
          }
        } else {
          response = `SQL sorgusu çalıştırılamadı: ${queryResult.error}\n\nÖnerilen Sorgu:\n\`\`\`sql\n${cleanSQL}\n\`\`\``;
        }
      } catch (error: any) {
        response = `Sorgu işlenirken hata: ${error.message}`;
      }
    } else {
      // General conversation
      const messages: Message[] = [
        ...(history || []).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: message },
      ];

      response = await generateResponse(messages, databaseStructure);
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
