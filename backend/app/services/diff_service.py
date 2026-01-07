from app.domain.models import LiveMatch, MatchEvent, EventType

def detect_changes(old: LiveMatch | None, new: LiveMatch) -> list[MatchEvent]:
    events = []
    
    #Need existing old match and valid new innings to compare
    if not old or not new.innings:
        return []

    #Identify the "Active" Inning (Last one in the list)
    #We assume the list is ordered or we sort by inning number
    new_innings_sorted = sorted(new.innings, key=lambda x: x.inning)
    new_active = new_innings_sorted[-1]
    
    #Find matching inning in old data
    old_innings_sorted = sorted(old.innings or [], key=lambda x: x.inning)
    old_active = next((i for i in old_innings_sorted if i.inning == new_active.inning), None)

    #If this is a fresh inning not in old match, we can't diff yet
    if not old_active:
        return []

    #Detect Wickets
    if new_active.wickets > old_active.wickets:
        wickets_fallen = new_active.wickets - old_active.wickets
        events.append(MatchEvent(
            match_id=new.match_id,
            event_type=EventType.WICKET,
            description=f"{wickets_fallen} Wicket(s) fallen!",
            inning=new_active.inning,
            over=str(new_active.overs)
        ))

    #Detect Boundaries (Runs Diff)
    runs_diff = new_active.score - old_active.score
    if runs_diff > 0:
        if runs_diff == 4:
            events.append(MatchEvent(
                match_id=new.match_id,
                event_type=EventType.FOUR,
                description="FOUR runs!",
                inning=new_active.inning,
                over=str(new_active.overs)
            ))
        elif runs_diff == 6:
            events.append(MatchEvent(
                match_id=new.match_id,
                event_type=EventType.SIX,
                description="SIX Runs!",
                inning=new_active.inning,
                over=str(new_active.overs)
            ))
    
    #Detect Over Change
    #Convert overs to float for comparison (e.g. 10.1 > 10.0)
    try:
        if int(float(new_active.overs)) > int(float(old_active.overs)):
            events.append(MatchEvent(
                match_id=new.match_id,
                event_type=EventType.OVER_END,
                description=f"End of Over {int(float(old_active.overs)) + 1}",
                inning=new_active.inning,
                over=str(new_active.overs)
            ))
    except (ValueError, TypeError):
        pass

    return events