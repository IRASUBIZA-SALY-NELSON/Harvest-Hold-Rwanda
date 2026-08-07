package rw.harvesthold.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.harvesthold.api.model.AdminUser;

import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmailIgnoreCase(String email);
}
