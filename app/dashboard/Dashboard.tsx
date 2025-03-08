"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import TableBox from "@/app/dashboard/TableBox";

interface DecodedToken {
  id: string;
  username: string;
  exp: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [newSheetName, setNewSheetName] = useState("");
  const [numRows, setNumRows] = useState(0);
  const [numCols, setNumCols] = useState(0);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token is found
    } else {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserName(decodedToken.username);
      console.log("Decoded token:", decodedToken);
      fetchSheets();
    }
  }, [router]);

  async function fetchSheets() {
    try {
      setIsLoading(true); // Start loading state
      const res = await fetch("/api/sheets");
      const data = await res.json();
      if (data.sheets) {
        setSheets(data.sheets);
        setSelectedSheet(data.sheets[0]); // Set first sheet after loading
      }
    } catch (error) {
      console.error("Error fetching sheets:", error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  }

  function generateTable() {
    const rows = Array.from({ length: numRows }, () => Array(numCols).fill(""));
    setTableData(rows);
  }

  function handleCellChange(row: number, col: number, value: string) {
    const updatedTable = [...tableData];
    updatedTable[row][col] = value;
    setTableData(updatedTable);
  }

  async function addSheet() {
    if (!newSheetName.trim() || tableData.length === 0) return;
    try {
      const res = await fetch("/api/add-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetName: newSheetName, data: tableData }),
      });

      if (res.ok) {
        setSheets((prevSheets) => [...prevSheets, newSheetName]);
        setSelectedSheet(newSheetName);
        setNewSheetName("");
        setNumRows(0);
        setNumCols(0);
        setTableData([]);
        setIsDialogOpen(false);
      } else {
        const errorData = await res.json();
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Error adding sheet:", error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 flex flex-col justify-between h-screen">
        <div>
          <h2 className="text-lg font-bold mb-4">DataSheetz</h2>
          <ul>
            {isLoading ? (
              // Loading skeleton placeholders
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              sheets.map((sheet) => (
                <li key={sheet} className="mb-2">
                  <Button
                    variant={selectedSheet === sheet ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedSheet(sheet)}
                  >
                    {sheet}
                  </Button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Add Table Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full flex gap-2 mt-auto">
              <PlusCircle size={16} /> Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Table</DialogTitle>
            </DialogHeader>
            <Input
              value={newSheetName}
              onChange={(e) => setNewSheetName(e.target.value)}
              placeholder="Enter sheet name"
            />
            <Input
              type="number"
              value={numRows}
              onChange={(e) => setNumRows(Number(e.target.value))}
              placeholder="Number of rows"
            />
            <Input
              type="number"
              value={numCols}
              onChange={(e) => setNumCols(Number(e.target.value))}
              placeholder="Number of columns"
            />
            <Button onClick={generateTable} className="w-full mt-2">
              Generate Table
            </Button>
            {tableData.length > 0 && (
              <div className="overflow-auto max-h-60 border mt-4 p-2">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td key={colIndex} className="border p-1">
                            <Input
                              value={cell}
                              onChange={(e) =>
                                handleCellChange(rowIndex, colIndex, e.target.value)
                              }
                              className="w-full"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Button onClick={addSheet} className="w-full mt-4">
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-1 flex justify-end items-center border-b bg-white">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                <span className="text-sm font-medium">{userName}</span>
                <Avatar>
                  <AvatarFallback>{userName ? userName[0] : 'U'}</AvatarFallback>
                </Avatar>
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-4 py-2 text-sm text-gray-700">{userName}</div>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500" onClick={handleLogout}>
                <LogOut size={16} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {selectedSheet && <TableBox sheet={selectedSheet} />}
        </main>
      </div>
    </div>
  );
}
