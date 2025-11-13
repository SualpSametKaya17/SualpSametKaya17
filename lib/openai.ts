import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateResponse(
  messages: Message[],
  databaseStructure: string
): Promise<string> {
  try {
    const systemPrompt = `Sen bir veritabanı analiz asistanısın. Kullanıcının MySQL veritabanı hakkında sorular soruyor ve rapor isteyebiliyor.

Veritabanı Yapısı:
${databaseStructure}

Görevlerin:
1. Kullanıcının sorularını analiz et
2. Gerekiyorsa SQL sorguları öner
3. Veritabanı verilerine dayalı analizler ve raporlar oluştur
4. Türkçe ve açıklayıcı cevaplar ver
5. Mümkünse grafik ve tablo önerileri sun

Önemli:
- SQL sorguları yazarken dikkatli ol ve güvenli sorgular öner
- Kullanıcıya nasıl rapor oluşturabileceğini açıkla
- Veritabanı yapısını göz önünde bulundur
- Pratik ve uygulanabilir öneriler sun`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || "Cevap oluşturulamadı";
  } catch (error: any) {
    throw new Error(`OpenAI API hatası: ${error.message}`);
  }
}

export async function generateSQLQuery(
  question: string,
  databaseStructure: string
): Promise<string> {
  try {
    const systemPrompt = `Sen bir SQL uzmanısın. Kullanıcının sorusuna göre güvenli ve optimize edilmiş SQL sorguları üretiyorsun.

Veritabanı Yapısı:
${databaseStructure}

Kurallar:
1. Sadece SELECT sorguları üret (INSERT, UPDATE, DELETE kullanma)
2. Sorgular güvenli ve optimize edilmiş olmalı
3. LIMIT kullanarak sonuç sayısını sınırla
4. Yorumlarla sorguyu açıkla
5. Sadece SQL sorgusunu döndür, başka açıklama ekleme`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Bu soru için SQL sorgusu oluştur: ${question}` },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "Sorgu oluşturulamadı";
  } catch (error: any) {
    throw new Error(`SQL sorgusu oluşturulamadı: ${error.message}`);
  }
}

export async function analyzeDataAndCreateReport(
  data: any[],
  question: string
): Promise<string> {
  try {
    const dataPreview = JSON.stringify(data.slice(0, 100), null, 2);

    const systemPrompt = `Sen bir veri analisti ve rapor uzmanısın. Veritabanından alınan verileri analiz edip profesyonel raporlar oluşturuyorsun.

Görevlerin:
1. Verileri analiz et
2. Önemli bulguları belirt
3. İstatistiksel özetler sun
4. Görselleştirme önerileri ver
5. Türkçe ve profesyonel bir rapor oluştur

Raporun şunları içermeli:
- Özet
- Temel Bulgular
- Detaylı Analiz
- Öneriler
- Grafik/Tablo Önerileri`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Soru: ${question}\n\nVeri Önizlemesi (ilk 100 kayıt):\n${dataPreview}\n\nToplam Kayıt: ${data.length}\n\nBu veriler için detaylı bir rapor oluştur.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || "Rapor oluşturulamadı";
  } catch (error: any) {
    throw new Error(`Rapor oluşturulamadı: ${error.message}`);
  }
}
