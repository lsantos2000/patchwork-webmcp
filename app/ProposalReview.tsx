'use client';

import type { Project } from './projectData';

interface ProposalReviewProps {
  proposal: Project | null;
  onApprove: () => void;
  onReject: () => void;
}

export function ProposalReview({ proposal, onApprove, onReject }: ProposalReviewProps) {
  if (!proposal) return null;

  return (
    <section className="proposal-review" aria-labelledby="proposal-title">
      <div>
        <p className="kicker">AGENT-DRAFTED · HUMAN DECISION</p>
        <h2 id="proposal-title">A new local need is ready for review.</h2>
        <p>The agent structured the idea, but only a person can add it to the neighbourhood catalog.</p>
      </div>
      <article className="proposal-card">
        <span>{proposal.type} · {proposal.area} · {proposal.time} hr{proposal.time === 1 ? '' : 's'}</span>
        <h3>{proposal.title}</h3>
        <p>{proposal.desc}</p>
        <div className="proposal-actions">
          <button className="proposal-reject" onClick={onReject}>Reject draft</button>
          <button className="proposal-approve" onClick={onApprove}>Approve and publish →</button>
        </div>
        <small>Nothing is published without human approval.</small>
      </article>
    </section>
  );
}
