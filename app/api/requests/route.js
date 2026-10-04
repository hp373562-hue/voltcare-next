import { cookies } from "next/headers";
import { verifyAdminSession } from "../../lib/session";
import { prisma } from "../../lib/prisma";

async function isAdminSignedIn() {
  const cookieStore = await cookies();
  const token = cookieStore.get("voltcare_admin")?.value;
  return verifyAdminSession(token);
}

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");

  if (!id && !(await isAdminSignedIn())) {
    return Response.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  if (id) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: id.trim().toLowerCase() }
    });

    if (!complaint) {
      return Response.json({ error: "No complaint found with that reference ID." }, { status: 404 });
    }

    return Response.json({
      id: complaint.id,
      category: complaint.category,
      status: complaint.status,
      createdAt: complaint.createdAt,
    });
  }

  const requests = await prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return Response.json(requests);
}

export async function POST(request) {
  const body = await request.json();
  const { category, area, description, consumerName, consumerNumber, photoBase64, photoMimeType } = body;

  if (
    typeof consumerName !== "string" || !consumerName.trim() ||
    typeof consumerNumber !== "string" || !/^[0-9]{12}$/.test(consumerNumber.trim()) ||
    !category || !area || !description
  ) {
    return Response.json({ error: "Enter a name and a valid 12-digit consumer number, and fill in all other fields." }, { status: 400 });
  }

  let aiCategory = "Unknown";
  let aiSummary = "No summary";
  let aiPriority = "Low";
  let aiResponse = "No response generated";

  try {
    const parts = [
      { text: `Analyze the following electricity complaint. Provide a JSON response with exactly these fields: "category" (e.g., Billing, Power Outage, Meter, Other), "summary" (a 1-2 sentence summary of the issue), "priority" (Low, Medium, High, Critical), "suggested_response" (a polite response to the consumer). \n\nConsumer issue: ${category}\nDescription: ${description}` }
    ];

    if (photoBase64 && photoMimeType) {
      parts.push({
        inline_data: {
          mime_type: photoMimeType,
          data: photoBase64
        }
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: { response_mime_type: "application/json" }
        })
      }
    );

    const data = await response.json();
    if (response.ok) {
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        const aiJson = JSON.parse(aiText);
        aiCategory = aiJson.category || category;
        aiSummary = aiJson.summary || description;
        aiPriority = aiJson.priority || "Medium";
        aiResponse = aiJson.suggested_response || "We are looking into it.";
      }
    }
  } catch (err) {
    console.error("AI Analysis error:", err);
  }

  const newRequest = await prisma.complaint.create({
    data: {
      consumerName: consumerName.trim(),
      consumerNumber: consumerNumber.trim(),
      category,
      area,
      description,
      status: "Received",
      aiCategory,
      aiSummary,
      aiPriority,
      aiResponse
    }
  });

  return Response.json(newRequest, { status: 201 });
}

export async function PATCH(request) {
  if (!(await isAdminSignedIn())) {
    return Response.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  const { id, status } = await request.json();
  const allowedStatuses = ["Received", "Under review", "Resolved"];

  if (!id || !allowedStatuses.includes(status)) {
    return Response.json({ error: "Request ID or status is invalid." }, { status: 400 });
  }

  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status }
    });
    return Response.json(complaint);
  } catch (err) {
    return Response.json({ error: "Complaint not found." }, { status: 404 });
  }
}