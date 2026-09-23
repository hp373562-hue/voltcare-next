import { cookies } from "next/headers";
import { verifyAdminSession } from "../../lib/session";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "requests.json");

async function readRequests() {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function isAdminSignedIn() {
  const cookieStore = await cookies();
  const token = cookieStore.get("voltcare_admin")?.value;
  return verifyAdminSession(token);
}

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");

  if (!id && !(await isAdminSignedIn())) {
    return Response.json(
      { error: "Admin sign-in required." },
      { status: 401 }
    );
  }

  const requests = await readRequests();

  if (id) {
    const complaint = requests.find(
      item => item.id.toLowerCase() === id.trim().toLowerCase()
    );

    if (!complaint) {
      return Response.json(
        { error: "No complaint found with that reference ID." },
        { status: 404 }
      );
    }

   return Response.json({
  id: complaint.id,
  category: complaint.category,
  status: complaint.status,
  createdAt: complaint.createdAt,
}); 
  }

  return Response.json(requests);
}

export async function POST(request) {
  const body = await request.json();
  const { category, area, description, consumerName, consumerNumber } = body;

  if (
    typeof consumerName !== "string" ||
    !consumerName.trim() ||
    typeof consumerNumber !== "string" ||
    !/^[0-9]{12}$/.test(consumerNumber.trim()) ||
    !category ||
    !area ||
    !description
  ) {
    return Response.json(
      {
        error:
          "Enter a name and a valid 12-digit consumer number, and fill in all other fields.",
      },
      { status: 400 }
    );
  }

  const requests = await readRequests();

  const newRequest = {
    id: randomUUID(),
    consumerName: consumerName.trim(),
    consumerNumber: consumerNumber.trim(),
    category,
    area,
    description,
    status: "Received",
    createdAt: new Date().toISOString(),
  };

  requests.unshift(newRequest);
  await writeFile(filePath, JSON.stringify(requests, null, 2));

  return Response.json(newRequest, { status: 201 });
}

export async function PATCH(request) {
  if (!(await isAdminSignedIn())) {
    return Response.json(
      { error: "Admin sign-in required." },
      { status: 401 }
    );
  }

  const { id, status } = await request.json();
  const allowedStatuses = ["Received", "Under review", "Resolved"];

  if (!id || !allowedStatuses.includes(status)) {
    return Response.json(
      { error: "Request ID or status is invalid." },
      { status: 400 }
    );
  }

  const requests = await readRequests();
  const complaint = requests.find(item => item.id === id);

  if (!complaint) {
    return Response.json(
      { error: "Complaint not found." },
      { status: 404 }
    );
  }

  complaint.status = status;
  await writeFile(filePath, JSON.stringify(requests, null, 2));

  return Response.json(complaint);
}