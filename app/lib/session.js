import { SignJWT, jwtVerify } from "jose";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing from .env.local");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession(username) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecretKey());
}

export async function getAdminSession(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (payload.role !== "admin" || typeof payload.username !== "string") {
      return null;
    }

    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function verifyAdminSession(token) {
  return Boolean(await getAdminSession(token));
}

export async function createConsumerSession(consumerNumber) {
  return new SignJWT({ role: "consumer", consumerNumber })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey());
}

export async function getConsumerSession(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (payload.role !== "consumer" || typeof payload.consumerNumber !== "string") {
      return null;
    }

    return { consumerNumber: payload.consumerNumber };
  } catch {
    return null;
  }
}

export async function verifyConsumerSession(token) {
  return Boolean(await getConsumerSession(token));
}