// Simple ping endpoint to check backend connectivity
export async function GET() {
  return Response.json({ status: "ok" });
}