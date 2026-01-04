import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
    const secret = process.env.ADMIN_JWT_SECRET || "butcher-and-sauce-artisanal-secret-2026-default";
    return new TextEncoder().encode(secret);
};

export async function signToken(payload: any) {
    const secret = getSecretKey();
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);
}

export async function verifyToken(token: string) {
    try {
        const secret = getSecretKey();
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}
