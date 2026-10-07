from typing import List, Dict, Any
from app.repositories.jobs_repository import jobs_repo

def normalize_skill(skill: str, aliases: Dict[str, str]) -> str:
    s_clean = skill.strip().lower()
    return aliases.get(s_clean, s_clean)

def get_top_market_skills(top_n: int = 25) -> List[Dict[str, Any]]:
    rs_df = jobs_repo.get_role_skill_df()
    if rs_df.empty:
        return []

    grouped = rs_df.groupby('skill').agg({
        'skill_postings': 'sum',
        'importance': 'mean',
        'lift': 'mean'
    }).reset_index()

    grouped.sort_values(by='skill_postings', ascending=False, inplace=True)
    results = []
    for _, row in grouped.head(top_n).iterrows():
        results.append({
            "skill": str(row['skill']).title(),
            "skill_postings": int(row['skill_postings']),
            "importance": round(float(row['importance']), 2),
            "lift": round(float(row['lift']), 2)
        })
    return results

def compute_skill_gap(target_role: str, candidate_skills: List[str]) -> Dict[str, Any]:
    rs_df = jobs_repo.get_role_skill_df()
    aliases = jobs_repo.get_skill_aliases()

    norm_target = target_role.strip().lower()
    norm_candidate = set(normalize_skill(s, aliases) for s in candidate_skills if s.strip())

    if rs_df.empty:
        return {
            "target_role": target_role,
            "matched_skills": list(candidate_skills),
            "missing_critical_skills": [],
            "match_percentage": 100.0,
            "skill_details": []
        }

    # Find matching role in role_skill df
    role_subset = rs_df[rs_df['role'].str.lower() == norm_target]
    if role_subset.empty:
        # Partial match
        matched_roles = rs_df[rs_df['role'].str.lower().str.contains(norm_target)]
        if not matched_roles.empty:
            role_subset = matched_roles

    if role_subset.empty:
        # Fallback to closest or top role
        role_subset = rs_df.head(20)

    # Sort role requirements by importance
    role_reqs = role_subset.sort_values(by='importance', ascending=False)
    
    matched = []
    missing = []
    details = []

    for _, row in role_reqs.iterrows():
        skill_name = str(row['skill']).lower()
        importance = float(row['importance'])
        postings = int(row['skill_postings'])
        
        is_matched = skill_name in norm_candidate
        if is_matched:
            matched.append(skill_name.title())
        else:
            if importance > 15.0 or len(missing) < 5:
                missing.append(skill_name.title())

        details.append({
            "skill": skill_name.title(),
            "importance": round(importance, 1),
            "postings": postings,
            "status": "Possessed" if is_matched else "Gap"
        })

    total_req = len(details)
    match_pct = round((len(matched) / max(total_req, 1)) * 100, 1) if total_req > 0 else 50.0

    return {
        "target_role": target_role,
        "matched_skills": matched,
        "missing_critical_skills": missing[:6],
        "match_percentage": match_pct,
        "skill_details": details[:15]
    }
