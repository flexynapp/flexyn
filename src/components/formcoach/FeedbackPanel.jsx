import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const SCORE_COLORS = {
  excellent: 'text-accent',
  good: 'text-chart-4',
  needswork: 'text-chart-5',
  poor: 'text-destructive',
};

function ScoreRing({ score }) {
  const pct = (score / 10) * 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const color = score >= 8 ? '#2dd4a0' : score >= 6 ? '#facc15' : score >= 4 ? '#fb923c' : '#ef4444';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span className="font-heading font-bold text-xl" style={{ color }}>{score}</span>
    </div>
  );
}

export default function FeedbackPanel({ feedback, exercise }) {
  const { t } = useLanguage();
  const { overall_score, form_rating, good_points = [], corrections = [], injury_risks = [], tip } = feedback;

  return (
    <Card className="mt-5 border-none shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-5 border-b border-border">
        <ScoreRing score={overall_score ?? 0} />
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">{t('formcoach.formAnalysis')} · {exercise}</p>
          <p className="font-heading font-bold text-xl">{form_rating}</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* What's good */}
        {good_points.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <p className="text-sm font-semibold">{t('formcoach.whatsGood')}</p>
            </div>
            <ul className="space-y-1.5">
              {good_points.map((p, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Corrections */}
        {corrections.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-chart-4" />
              <p className="text-sm font-semibold">{t('formcoach.corrections')}</p>
            </div>
            <ul className="space-y-1.5">
              {corrections.map((c, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-chart-4 mt-0.5">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Injury risks */}
        {injury_risks.length > 0 && (
          <div className="rounded-xl bg-destructive/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-destructive">{t('formcoach.injuryRisks')}</p>
            </div>
            <ul className="space-y-1">
              {injury_risks.map((r, i) => (
                <li key={i} className="text-sm text-destructive/80 flex gap-2">
                  <span>⚠</span><span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Coach tip */}
        {tip && (
          <div className="rounded-xl bg-primary/10 p-4 flex gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{tip}</p>
          </div>
        )}
      </div>
    </Card>
  );
}