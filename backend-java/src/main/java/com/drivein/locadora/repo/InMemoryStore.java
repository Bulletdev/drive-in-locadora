package com.drivein.locadora.repo;

import com.drivein.locadora.model.User;
import com.drivein.locadora.model.Vehicle;
import com.drivein.locadora.model.Reservation;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryStore {
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final Map<String, String> tokens = new ConcurrentHashMap<>(); // token -> email
    private final Map<String, Vehicle> vehicles = new ConcurrentHashMap<>();
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<>();

    public InMemoryStore() {
        seedVehicles();
        seedUsers();
    }

    public Optional<User> getUserByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email.toLowerCase(Locale.ROOT)));
    }

    public boolean existsCpf(String cpf) {
        if (cpf == null) return false;
        String needle = cpf.trim();
        for (User u : usersByEmail.values()) {
            if (needle.equalsIgnoreCase(u.getCpf())) {
                return true;
            }
        }
        return false;
    }

    public User addUser(User user) {
        if (user.getId() == null || user.getId().isBlank()) {
            user.setId(UUID.randomUUID().toString());
        }
        if (user.getCreatedAt() == null || user.getCreatedAt().isBlank()) {
            user.setCreatedAt(java.time.Instant.now().toString());
        }
        usersByEmail.put(user.getEmail().toLowerCase(Locale.ROOT), user);
        return user;
    }

    public String issueTokenFor(String email) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, email.toLowerCase(Locale.ROOT));
        return token;
    }

    public Optional<String> emailByToken(String token) {
        return Optional.ofNullable(tokens.get(token));
    }

    public Collection<Vehicle> getAllVehicles() { return vehicles.values(); }
    public Optional<Vehicle> getVehicle(String id) { return Optional.ofNullable(vehicles.get(id)); }

    public Reservation addReservation(Reservation r) {
        if (r.getId() == null || r.getId().isEmpty()) {
            r.setId(UUID.randomUUID().toString());
        }
        reservations.put(r.getId(), r);
        return r;
    }

    public List<Reservation> reservationsByUser(String email) {
        List<Reservation> list = new ArrayList<>();
        for (Reservation r : reservations.values()) {
            if (email.equalsIgnoreCase(r.getUserEmail())) list.add(r);
        }
        return list;
    }

    private void seedVehicles() {
        // Toyota Corolla 2024
        Vehicle corolla = new Vehicle();
        corolla.setId("toyota-corolla-2024");
        corolla.setName("Toyota Corolla");
        corolla.setCategory("Sedan");
        corolla.setYear(2024);
        corolla.setImages(new String[]{
                "/cars/toyota-corolla-1.jpg",
                "/cars/toyota-corolla-2.jpg",
                "/cars/toyota-corolla-3.jpg",
                "/cars/toyota-corolla-4.jpg"
        });
        corolla.setPricePerDay(180);
        corolla.setTransmission("Automática");
        corolla.setPassengers(5);
        corolla.setFuel("Flex");
        corolla.setDoors(4);
        corolla.setAirConditioning(true);
        corolla.setDescription("O Toyota Corolla 2024 é um sedan confiável e sofisticado, perfeito para viagens longas ou uso executivo. Destaca-se pelo design moderno com nova grade frontal em preto piano, faróis full LED com assistência automática de facho alto e tecnologia avançada com central multimídia de 12,3 polegadas.");
        corolla.setFeatures(new String[]{
                "Ar-condicionado automático dual zone",
                "Direção elétrica progressiva",
                "Vidros elétricos com one touch",
                "Travas elétricas com travamento automático",
                "Central multimídia 12,3\" com Android Auto e Apple CarPlay",
                "Cluster digital TFT 12,3\"",
                "Bluetooth e USB",
                "Câmera de ré com visão 360°",
                "Sensor de estacionamento frontal e traseiro",
                "8 Airbags",
                "ABS com EBD",
                "Controle de estabilidade e tração",
                "Faróis full LED com DRL",
                "Rodas de liga leve 17\"",
                "Bancos em couro",
                "Piloto automático adaptativo",
        });
        corolla.setAvailable(true);
        vehicles.put(corolla.getId(), corolla);

        // Jeep Compass 2024
        Vehicle compass = new Vehicle();
        compass.setId("jeep-compass-2024");
        compass.setName("Jeep Compass");
        compass.setCategory("SUV");
        compass.setYear(2024);
        compass.setImages(new String[]{
                "/cars/jeep-compass-1.jpg",
                "/cars/jeep-compass-2.jpg",
                "/cars/jeep-compass-3.jpg",
                "/cars/jeep-compass-4.jpg"
        });
        compass.setPricePerDay(320);
        compass.setTransmission("Automática");
        compass.setPassengers(5);
        compass.setFuel("Flex");
        compass.setDoors(4);
        compass.setAirConditioning(true);
        compass.setDescription("O Jeep Compass 2024 é o SUV médio mais tecnológico do segmento. Com design icônico, grade de sete fendas, faróis full LED e interior premium. Disponível com motor turbo flex ou turbodiesel. Oferece capacidade off-road com tração 4x4 e sistema Selec-Terrain para diferentes tipos de terreno.");
        compass.setFeatures(new String[]{
                "Ar-condicionado automático dual zone",
                "Direção elétrica",
                "Vidros elétricos com one touch",
                "Travas elétricas",
                "Central multimídia Uconnect 10,1\" touchscreen",
                "Painel digital customizável 10,25\"",
                "Android Auto e Apple CarPlay sem fio",
                "Carregamento wireless",
                "Bluetooth",
                "Câmera de ré com park assist",
                "Sensores de estacionamento 360°",
                "7 Airbags",
                "ABS com EBD",
                "Controle de estabilidade e tração",
                "Sistema Selec-Terrain (tração 4x4)",
                "Faróis full LED bi-xenon",
                "Rodas de liga leve 18\"",
                "Teto solar panorâmico",
                "Bancos em couro",
                "Controle de cruzeiro adaptativo",
        });
        compass.setAvailable(false);
        compass.setAvailable(true);
        vehicles.put(compass.getId(), compass);

        // Hyundai HB20 2023
        Vehicle hb20 = new Vehicle();
        hb20.setId("hyundai-hb20-2023");
        hb20.setName("Hyundai HB20");
        hb20.setCategory("Hatchback");
        hb20.setYear(2023);
        hb20.setImages(new String[]{
                "/cars/hyundai-hb20-1.jpg",
                "/cars/hyundai-hb20-2.jpg",
                "/cars/hyundai-hb20-3.jpg",
                "/cars/hyundai-hb20-4.jpg"
        });
        hb20.setPricePerDay(130);
        hb20.setTransmission("Manual");
        hb20.setPassengers(5);
        hb20.setFuel("Flex");
        hb20.setDoors(4);
        hb20.setAirConditioning(true);
        hb20.setDescription("O Hyundai HB20 2023 renovado traz design mais moderno com faróis finos integrados à grade frontal e lanternas traseiras redesenhadas inspiradas no Tucson. Hatchback compacto econômico, ideal para uso diário na cidade com boa dirigibilidade e conforto.");
        hb20.setFeatures(new String[]{
                "Ar-condicionado",
                "Direção elétrica",
                "Vidros elétricos dianteiros",
                "Travas elétricas",
                "Central multimídia Bluelink 8\" touchscreen",
                "Android Auto e Apple CarPlay",
                "Bluetooth",
                "Câmera de ré",
                "Computador de bordo",
                "2 Airbags",
                "ABS com EBD",
                "Controle de estabilidade ESC",
                "Faróis com projetor",
                "Lanternas em LED",
                "Rodas de aço 15\" com calotas",
                "Volante multifuncional",
        });
        hb20.setAvailable(true);
        vehicles.put(hb20.getId(), hb20);

        // Chevrolet Onix 2023
        Vehicle onix = new Vehicle();
        onix.setId("chevrolet-onix-2023");
        onix.setName("Chevrolet Onix");
        onix.setCategory("Hatchback");
        onix.setYear(2024);
        onix.setImages(new String[]{
                "/cars/chevrolet-onix-1.jpg",
                "/cars/chevrolet-onix-2.jpg",
                "/cars/chevrolet-onix-3.jpg",
                "/cars/chevrolet-onix-4.jpg"
        });
        onix.setPricePerDay(120);
        onix.setTransmission("Manual");
        onix.setPassengers(5);
        onix.setFuel("Flex");
        onix.setDoors(4);
        onix.setAirConditioning(true);
        onix.setDescription("O Chevrolet Onix 2024 é o hatchback mais vendido do Brasil. Com design moderno e grade frontal unificada aos faróis, oferece excelente custo-benefício. Motor 1.0 econômico, ideal para uso urbano e viagens curtas com baixo consumo de combustível.");
        onix.setFeatures(new String[]{
                "Ar-condicionado",
                "Direção elétrica",
                "Vidros elétricos dianteiros",
                "Travas elétricas",
                "Central multimídia MyLink 8\" touchscreen",
                "Android Auto e Apple CarPlay",
                "Bluetooth",
                "Câmera de ré",
                "Computador de bordo",
                "2 Airbags",
                "ABS com EBD",
                "Controle de estabilidade e tração",
                "Faróis com máscara negra",
                "Rodas de aço 15\" com calotas",
                "Volante multifuncional",
                "Alarme",
        });
        onix.setAvailable(true);
        vehicles.put(onix.getId(), onix);

        // Honda HR-V 2024
        Vehicle hrv = new Vehicle();
        hrv.setId("honda-hrv-2024");
        hrv.setName("Honda HR-V");
        hrv.setCategory("SUV");
        hrv.setYear(2024);
        hrv.setImages(new String[]{
                "/cars/honda-hrv-1.jpg",
                "/cars/honda-hrv-2.jpg",
                "/cars/honda-hrv-3.jpg",
                "/cars/honda-hrv-4.jpg"
        });
        hrv.setPricePerDay(250);
        hrv.setTransmission("Automática");
        hrv.setPassengers(5);
        hrv.setFuel("Flex");
        hrv.setDoors(4);
        hrv.setAirConditioning(true);
        hrv.setDescription("O Honda HR-V 2024 combina design arrojado com tecnologia de ponta. SUV compacto com visual de cupê, oferece amplo espaço interno graças ao sistema de bancos Magic Seat, faróis full LED e central multimídia moderna. Ideal para quem busca versatilidade e conforto.");
        hrv.setFeatures(new String[]{
                "Ar-condicionado automático digital",
                "Direção elétrica",
                "Vidros elétricos",
                "Travas elétricas",
                "Central multimídia touchscreen 8\"",
                "Android Auto e Apple CarPlay sem fio",
                "Painel digital 7\"",
                "Bluetooth",
                "Câmera de ré multi-ângulo",
                "Sensor de estacionamento traseiro",
                "6 Airbags",
                "ABS com EBD",
                "Controle de estabilidade VSA",
                "Assistente de partida em rampa",
                "Faróis full LED",
                "Rodas de liga leve 17\"",
                "Banco do motorista com ajuste elétrico",
                "Sistema Magic Seat (bancos reconfiguráveis)",
        });
        hrv.setAvailable(true);
        vehicles.put(hrv.getId(), hrv);

        // Nissan Kicks 2024
        Vehicle kicks = new Vehicle();
        kicks.setId("nissan-kicks-2024");
        kicks.setName("Nissan Kicks");
        kicks.setCategory("SUV");
        kicks.setYear(2024);
        kicks.setImages(new String[]{
                "/cars/nissan-kicks-1.jpg",
                "/cars/nissan-kicks-2.jpg",
                "/cars/nissan-kicks-3.jpg",
                "/cars/nissan-kicks-4.jpg"
        });
        kicks.setPricePerDay(260);
        kicks.setTransmission("Automático");
        kicks.setPassengers(5);
        kicks.setFuel("Flex");
        kicks.setDoors(4);
        kicks.setAirConditioning(true);
        kicks.setDescription("O Nissan Kicks 2024 é um SUV compacto inovador com design diferenciado e lanternas em formato boomerang. Destaca-se pelo amplo porta-malas, tecnologia Nissan Safety Shield com assistentes de condução e interior espaçoso. Motor 1.6 flex com câmbio CVT garante boa economia e conforto.");
        kicks.setFeatures(new String[]{
                "Ar-condicionado automático digital",
                "Direção elétrica",
                "Vidros elétricos com one touch",
                "Travas elétricas",
                "Central multimídia 8\" touchscreen",
                "Painel digital 7\" customizável",
                "Android Auto e Apple CarPlay",
                "Bluetooth",
                "Câmera de ré 360°",
                "Sensor de estacionamento traseiro",
                "6 Airbags",
                "ABS com EBD",
                "Controle de estabilidade VDC",
                "Assistente de partida em rampa",
                "Faróis full LED com DRL",
                "Lanternas LED em formato boomerang",
                "Rodas de liga leve 17\"",
                "Volante multifuncional em couro",
                "Sistema Nissan Safety Shield",
        });
        kicks.setAvailable(true);
        vehicles.put(kicks.getId(), kicks);

        // Audi A5 2022
        Vehicle audiA5 = new Vehicle();
        audiA5.setId("audi-a5-2022");
        audiA5.setName("Audi A5");
        audiA5.setCategory("Cupê");
        audiA5.setYear(2026);
        audiA5.setImages(new String[]{
                "/cars/audi-a5-1.jpg",
                "/cars/audi-a5-2.jpg",
                "/cars/audi-a5-3.jpg",
                "/cars/audi-a5-4.jpg"
        });
        audiA5.setPricePerDay(450);
        audiA5.setTransmission("Automática");
        audiA5.setPassengers(5);
        audiA5.setFuel("Gasolina");
        audiA5.setDoors(4);
        audiA5.setAirConditioning(true);
        audiA5.setDescription("O Audi A5 Sportback 2025 é um cupê de quatro portas que combina elegância, sofisticação e tecnologia alemã. Motor 2.0 TFSI turbo de 204 cv e 32,6 kgfm de torque, com transmissão S tronic de 7 velocidades e tração Quattro integral. Acelera de 0-100 km/h em 6,8 segundos. Design refinado com linhas esportivas e acabamento premium.");
        audiA5.setFeatures(new String[]{
                "Ar-condicionado automático dual zone",
                "Direção elétrica progressiva",
                "Vidros elétricos com one touch",
                "Travas elétricas",
                "Central multimídia MMI touchscreen com navegação",
                "Painel digital Audi Virtual Cockpit 12,3\"",
                "Android Auto e Apple CarPlay sem fio",
                "Bluetooth e USB-C",
                "Câmera de ré com linhas dinâmicas",
                "Sensores de estacionamento 360°",
                "6 Airbags",
                "ABS com EBD",
                "Controle de estabilidade ESC",
                "Tração integral Quattro permanente",
                "Faróis full LED Matrix com assinatura luminosa",
                "Rodas de liga leve S Line 20\"",
                "Bancos esportivos em couro com ajuste elétrico",
                "Volante multifuncional esportivo em couro",
        });
        audiA5.setAvailable(true);
        vehicles.put(audiA5.getId(), audiA5);

        // Chevrolet Camaro 2021
        Vehicle camaro = new Vehicle();
        camaro.setId("chevrolet-camaro-ss-2024");
        camaro.setName("Chevrolet Camaro SS");
        camaro.setCategory("Esportivo");
        camaro.setYear(2024);
        camaro.setImages(new String[]{
                "/cars/chevrolet-camaro-1.jpg",
                "/cars/chevrolet-camaro-2.jpg",
                "/cars/chevrolet-camaro-3.jpg",
                "/cars/chevrolet-camaro-4.jpg"
        });
        camaro.setPricePerDay(650);
        camaro.setTransmission("Automática");
        camaro.setPassengers(2);
        camaro.setFuel("Gasolina");
        camaro.setDoors(2);
        camaro.setAirConditioning(true);
        camaro.setDescription("O Chevrolet Camaro SS 2024 é um ícone muscle car americano com design agressivo e performance brutal. Equipado com motor V8 6.2 de 461 cv e 62,9 kgfm de torque, acelera de 0-100 km/h em apenas 4,2 segundos. Transmissão automática de 10 velocidades e velocidade máxima de 290 km/h. Cupê esportivo 2+2 lugares (bancos traseiros limitados).");
        camaro.setFeatures(new String[]{
                "Ar-condicionado automático dual zone",
                "Direção elétrica com assistência variável",
                "Central multimídia com tela touchscreen",
                "Android Auto e Apple CarPlay",
                "Bluetooth e Wi-Fi nativo",
                "Sistema de áudio premium",
                "Câmera de ré",
                "Sensores de estacionamento",
                "6 Airbags",
                "ABS com EBD",
                "Controle de estabilidade e tração",
                "4 modos de condução (Passeio, Esporte, Pista, Neve)",
                "Faróis LED com DRL",
                "Rodas de liga leve esportivas 20\"",
                "Bancos esportivos em couro",
                "Volante esportivo multifuncional",
        });
        camaro.setAvailable(true);
        vehicles.put(camaro.getId(), camaro);
    }

    private void seedUsers() {
        // Usuário admin de demonstração
        User admin = new User();
        admin.setId(UUID.randomUUID().toString());
        admin.setName("Admin Demo");
        admin.setEmail("admin@drivein.local");
        admin.setPhone("(11) 99999-9999");
        admin.setCpf("000.000.000-00");
        admin.setPassword("123456");
        admin.setCreatedAt(java.time.Instant.now().toString());
        addUser(admin);

        // Usuário teste
        User tester = new User();
        tester.setId(UUID.randomUUID().toString());
        tester.setName("Usuário Teste");
        tester.setEmail("teste@teste.com");
        tester.setPhone("(11) 98888-7777");
        tester.setCpf("111.111.111-11");
        tester.setPassword("123456");
        tester.setCreatedAt(java.time.Instant.now().toString());
        addUser(tester);
    }
}