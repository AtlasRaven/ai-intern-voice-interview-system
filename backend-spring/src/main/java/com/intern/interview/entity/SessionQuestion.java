package com.intern.interview.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "session_questions", uniqueConstraints = {
    @UniqueConstraint(name = "uq_session_question_order", columnNames = {"session_id", "sequence_order"})
})
public class SessionQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Column(name = "asked_at", nullable = false)
    private OffsetDateTime askedAt = OffsetDateTime.now();

    public SessionQuestion() {}

    public SessionQuestion(InterviewSession session, Question question, Integer sequenceOrder) {
        this.session = session;
        this.question = question;
        this.sequenceOrder = sequenceOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public Integer getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(Integer sequenceOrder) { this.sequenceOrder = sequenceOrder; }

    public OffsetDateTime getAskedAt() { return askedAt; }
    public void setAskedAt(OffsetDateTime askedAt) { this.askedAt = askedAt; }
}
