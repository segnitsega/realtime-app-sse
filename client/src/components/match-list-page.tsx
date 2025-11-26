import type React from "react";

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}

interface MatchListPageProps {
  matches: Match[];
  onSelectMatch: (matchId: string) => void;
}

export const MatchListPage: React.FC<MatchListPageProps> = ({
  matches,
  onSelectMatch,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-background">
      <h1 className="text-2xl font-semibold text-foreground mb-8">
        Live Matches
      </h1>

      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No matches in progress</p>
          </div>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="p-5 bg-card border border-border rounded-lg hover:border-muted-foreground/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    {match.teamA}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-2xl font-bold text-foreground">
                    {match.scoreA}
                  </p>
                  <p className="text-xl font-bold text-muted-foreground">
                    :
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {match.scoreB}
                  </p>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {match.teamB}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectMatch(match.id)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
