import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    console.log("Fetching Sheets...");

    // Log essential environment variables (DO NOT expose the private key)
    console.log("GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log("GOOGLE_SHEET_ID:", process.env.GOOGLE_SHEET_ID);

    // Check if required environment variables exist
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      console.error("Missing Google API credentials");
      return NextResponse.json({ error: "Missing Google API credentials" }, { status: 500 });
    }

    // Ensure the private key is correctly formatted
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log("Private key formatted successfully");

    // Authenticate with Google Sheets API
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      privateKey, // Use the correctly formatted private key
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    console.log("Authenticated successfully");

    const sheets = google.sheets({ version: "v4", auth });

    // Fetch spreadsheet metadata to get sheet names
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID });

    console.log("Fetched metadata:", metadata.data);

    const sheetNames = metadata.data.sheets?.map((sheet) => sheet.properties?.title) || [];

    return NextResponse.json({ sheets: sheetNames }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching sheets:", error.message);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error fetching sheets:", error);
      return NextResponse.json(
        { error: "Internal Server Error", details: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
