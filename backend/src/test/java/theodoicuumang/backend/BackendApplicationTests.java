package theodoicuumang.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Test cơ bản chỉ kiểm tra context load được.
 * Dùng H2 in-memory để không cần MySQL thật khi chạy unit test.
 */
@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL;NON_KEYWORDS=VALUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.globally_quoted_identifiers=true"
})
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // Kiểm tra Spring context khởi tạo thành công
    }
}
