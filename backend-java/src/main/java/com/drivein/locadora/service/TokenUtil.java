package com.drivein.locadora.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class TokenUtil {
    private static String secret() {
        String s = System.getenv("AUTH_SECRET");
        if (s == null || s.isBlank()) {
            s = System.getenv("NEXTAUTH_SECRET");
        }
        if (s == null || s.isBlank()) {
            s = "dev-secret";
        }
        return s;
    }

    public static String issueTokenFor(String email) {
        try {
            String payload = email;
            String sig = hmacSha256(payload, secret());
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString((payload + ":" + sig).getBytes(StandardCharsets.UTF_8));
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Failed to issue token: " + e.getMessage(), e);
        }
    }

    public static String extractEmail(String token) {
        if (token == null || token.isBlank()) return null;
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String combined = new String(decoded, StandardCharsets.UTF_8);
            int idx = combined.lastIndexOf(":");
            if (idx <= 0) return null;
            String payload = combined.substring(0, idx);
            String sig = combined.substring(idx + 1);
            String expected = hmacSha256(payload, secret());
            if (!constantTimeEquals(sig, expected)) return null;
            return payload;
        } catch (Exception e) {
            return null;
        }
    }

    private static String hmacSha256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] out = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(out);
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) return false;
        if (a.length() != b.length()) return false;
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}