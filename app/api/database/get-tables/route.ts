import { NextRequest, NextResponse } from "next/server";
import { getTables } from "@/lib/mysql";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { host, port, user, password, database } = body;

    if (!host || !port || !user || !database) {
      return NextResponse.json(
        { success: false, error: "Eksik bağlantı bilgileri" },
        { status: 400 }
      );
    }

    const result = await getTables({ host, port, user, password, database });

    if (result.success) {
      return NextResponse.json({
        success: true,
        tables: result.tables,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
