package com.intern.interview.dto;

import jakarta.validation.constraints.NotBlank;

public class SaveTranscriptSegmentRequest {

    private Long questionId;

    @NotBlank(message = "Câu hỏi không được để trống")
    private String questionText;

    @NotBlank(message = "Câu trả lời không được để trống")
    private String answerText;

    private Integer durationSeconds = 0;

    private String audioRecordingUrl;

    public SaveTranscriptSegmentRequest() {}

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getAudioRecordingUrl() { return audioRecordingUrl; }
    public void setAudioRecordingUrl(String audioRecordingUrl) { this.audioRecordingUrl = audioRecordingUrl; }
}
