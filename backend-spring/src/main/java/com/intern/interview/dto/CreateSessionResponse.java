package com.intern.interview.dto;

public class CreateSessionResponse {
    private Long sessionId;
    private String sessionToken;
    private String gatewayWsUrl;

    public CreateSessionResponse() {}

    public CreateSessionResponse(Long sessionId, String sessionToken, String gatewayWsUrl) {
        this.sessionId = sessionId;
        this.sessionToken = sessionToken;
        this.gatewayWsUrl = gatewayWsUrl;
    }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public String getGatewayWsUrl() { return gatewayWsUrl; }
    public void setGatewayWsUrl(String gatewayWsUrl) { this.gatewayWsUrl = gatewayWsUrl; }
}
