import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req) {
  try {
    const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      return NextResponse.json({ error: "Missing Google API credentials" }, { status: 500 });
    }

    const auth = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const { sheetName, data } = await req.json();
    if (!sheetName || !Array.isArray(data)) {
      return NextResponse.json({ error: "Sheet name and data are required" }, { status: 400 });
    }

    // Create a new sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_SHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: sheetName },
            },
          },
        ],
      },
    });

    // Insert data into the new sheet
    const range = `${sheetName}!A1`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
      valueInputOption: "RAW",
      requestBody: { values: data },
    });

    return NextResponse.json({ message: `Sheet "${sheetName}" created and populated successfully` });
  } catch (error) {
    console.error("Error adding sheet:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
