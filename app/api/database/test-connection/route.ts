import { NextRequest, NextResponse } from "next/server";
import { testConnection } from "@/lib/mysql";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { host, port, user, password } = body;

    if (!host || !port || !user) {
      return NextResponse.json(
        { success: false, error: "Eksik bağlantı bilgileri" },
        { status: 400 }
      );
    }

    const result = await testConnection({ host, port, user, password });

    if (result.success) {
      return NextResponse.json({
        success: true,
        databases: result.databases,
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
