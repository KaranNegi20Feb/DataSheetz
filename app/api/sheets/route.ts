import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    // Load environment variables
    const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      return NextResponse.json({ error: "Missing Google API credentials" }, { status: 500 });
    }

    // Authenticate with Google Sheets API
    const auth = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix line breaks
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Fetch metadata to get sheet names
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: GOOGLE_SHEET_ID });

    const sheetNames = metadata.data.sheets?.map((sheet) => sheet.properties?.title) || [];

    return NextResponse.json({ sheets: sheetNames }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sheets:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
