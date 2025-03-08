"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableBoxProps {
  sheet: string | null;
}

export default function TableBox({ sheet }: TableBoxProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sheet) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/sheet-data?name=${sheet}`);
        const result = await res.json();
        if (res.ok) {
          setData(result.data);
        } else {
          setError(result.error || "Failed to load data");
        }
      } catch (err) {
        setError("Network error");
      }

      setLoading(false);
    }

    fetchData();
  }, [sheet]);

  return (
    <Card className="p-4 border shadow-none">
      {/* Sheet Title */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{sheet || "No Sheet Selected"}</h3>
      </div>

      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="w-full border rounded-lg">
            <TableHeader>
              <TableRow className="bg-gray-100">
                {Object.keys(data[0]).map((key) => (
                  <TableHead key={key} className="p-2 text-left font-medium">
                    {key.toUpperCase()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50">
                  {Object.keys(row).map((key) => (
                    <TableCell key={key} className="p-2 border">
                      {row[key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-gray-500">No data available.</p>
      )}
    </Card>
  );
}
