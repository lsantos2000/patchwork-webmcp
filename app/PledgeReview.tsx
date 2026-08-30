'use client';

export interface PledgeDraft {
  project_id: string;
  project_title: string;
  contribution: string;
}

export function PledgeReview({ draft, reviewed, onReview, onDismiss }: {
  draft: PledgeDraft | null;
  reviewed: boolean;
  onReview: () => void;
  onDismiss: () => void;
}) {
  if (!draft) return null;
  return (
    <section className="proposal-review" aria-labelledby="pledge-title">
      <div>
        <p className="kicker">PLEDGE DRAFT · NOT SUBMITTED</p>
        <h2 id="pledge-title">Review your contribution draft.</h2>
        <p>This prototype cannot send pledges or contact organizers. Reviewing only acknowledges this draft in the current session.</p>
      </div>
      <article className="proposal-card">
        <h3>{draft.project_title}</h3>
        <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{draft.contribution}</p>
        <p role="status">{reviewed ? 'Draft reviewed locally. No pledge sent.' : 'Your review is required. No pledge sent.'}</p>
        <div className="proposal-actions">
          <button className="proposal-reject" onClick={onDismiss}>Dismiss pledge draft</button>
          <button className="proposal-approve" onClick={onReview} disabled={reviewed}>Mark draft reviewed</button>
        </div>
        <small>This draft is not saved across visits.</small>
      </article>
    </section>
  );
}
