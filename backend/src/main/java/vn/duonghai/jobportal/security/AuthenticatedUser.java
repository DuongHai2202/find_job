package vn.duonghai.jobportal.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.UserStatus;

import java.util.Collection;
import java.util.List;

public record AuthenticatedUser(
        Long id,
        String email,
        String password,
        Collection<? extends GrantedAuthority> authorities,
        boolean enabled
) implements UserDetails {

    public static AuthenticatedUser from(User user) {
        return new AuthenticatedUser(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                user.getStatus() != UserStatus.LOCKED
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return enabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}