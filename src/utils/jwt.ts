export function decodeToken(token: string) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload; // { sub, role, iat, exp }
    } catch (e) {
        return null;
    }
}
