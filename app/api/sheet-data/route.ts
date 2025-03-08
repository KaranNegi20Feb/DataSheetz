import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const sheetName = url.searchParams.get("name");

    if (!sheetName) {
      return NextResponse.json({ error: "Missing sheet name" }, { status: 400 });
    }

    const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      return NextResponse.json({ error: "Missing Google API credentials" }, { status: 500 });
    }

    const auth = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${sheetName}!A1:Z1000`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Convert first row into keys for objects
    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((key, index) => [key, row[index] || ""]))
    );

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
