package Backend.auth.dto;

public class AuthReponse {
    private String token;

    public AuthReponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
