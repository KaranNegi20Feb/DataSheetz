import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    console.log("Fetching Sheets...");

    // Log environment variables (DO NOT expose private key)
    console.log("GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log("GOOGLE_SHEET_ID:", process.env.GOOGLE_SHEET_ID);
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      console.error("Missing Google API credentials");
      return NextResponse.json({ error: "Missing Google API credentials" }, { status: 500 });
    }

    // Authenticate with Google Sheets API
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    console.log("Authenticated successfully");

    const sheets = google.sheets({ version: "v4", auth });

    // Fetch metadata to get sheet names
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });

    console.log("Fetched metadata:", metadata.data);

    const sheetNames = metadata.data.sheets?.map((sheet) => sheet.properties?.title) || [];

    return NextResponse.json({ sheets: sheetNames }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sheets:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
