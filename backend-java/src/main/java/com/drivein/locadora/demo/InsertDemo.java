package com.drivein.locadora.demo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

/**
 * Pequena aplicação JDBC para inserir um usuário e endereço no MySQL.
 * Use variáveis de ambiente: DB_URL, DB_USER, DB_PASS.
 * Exemplo DB_URL: jdbc:mysql://localhost:3306/drivein?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
 */
public class InsertDemo {
    public static void main(String[] args) {
        String url = env("DB_URL", "jdbc:mysql://localhost:3306/drivein?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
        String user = env("DB_USER", "root");
        String pass = env("DB_PASS", "root");

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            conn.setAutoCommit(false);

            long userId = insertUser(conn,
                    "Aluno Demo",
                    "aluno.demo@drivein.local",
                    "123456",
                    "client",
                    "666.666.666-66",
                    "+55 11 90000-0066");

            insertAddress(conn, userId,
                    "Rua do Trabalho", "100", null, "Centro", "São Paulo", "SP", "01010-010");

            conn.commit();
            System.out.println("Inserção concluída. Novo user_id=" + userId);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static String env(String key, String def) {
        String v = System.getenv(key);
        return v != null ? v : def;
    }

    private static long insertUser(Connection conn, String name, String email, String passwordHash,
                                   String role, String cpf, String phone) throws SQLException {
        String sql = "INSERT INTO users (name, email, password_hash, role, cpf, phone, created_at, active) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
        try (PreparedStatement ps = conn.prepareStatement(sql, new String[]{"id"})) {
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, passwordHash);
            ps.setString(4, role);
            ps.setString(5, cpf);
            ps.setString(6, phone);
            ps.setObject(7, LocalDateTime.now());
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        }
        throw new SQLException("Falha ao inserir usuário");
    }

    private static void insertAddress(Connection conn, long userId, String street, String number, String complement,
                                      String district, String city, String state, String zip) throws SQLException {
        String sql = "INSERT INTO addresses (user_id, street, number, complement, district, city, state, zip_code) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ps.setString(2, street);
            ps.setString(3, number);
            ps.setString(4, complement);
            ps.setString(5, district);
            ps.setString(6, city);
            ps.setString(7, state);
            ps.setString(8, zip);
            ps.executeUpdate();
        }
    }
}