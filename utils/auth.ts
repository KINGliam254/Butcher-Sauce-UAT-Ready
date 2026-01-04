import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
    const secret = process.env.ADMIN_JWT_SECRET || "butcher-and-sauce-artisanal-secret-2026-default";
    return new TextEncoder().encode(secret);
};

export async function signToken(payload: any) {
    try {
        console.log(">>> [AUTH/SIGN] Starting signing...");
        const secret = getSecretKey();
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);
        console.log(">>> [AUTH/SIGN] Success.");
        return token;
    } catch (error) {
        console.error(">>> [AUTH/SIGN] Error:", error);
        throw error;
    }
}

export async function verifyToken(token: string) {
    try {
        console.log(">>> [AUTH/VERIFY] Verifying token...");
        const secret = getSecretKey();
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });
        console.log(">>> [AUTH/VERIFY] Success.");
        return payload;
    } catch (error: any) {
        console.log(">>> [AUTH/VERIFY] Failed:", error.message);
        return null;
    }
}
