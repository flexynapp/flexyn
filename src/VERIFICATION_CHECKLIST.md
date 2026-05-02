# Fatigue Rule Verification Checklist

## Test User Profile
- Age: 25M
- Weight: 190 lbs
- Height: 6'2"
- Expected daily volume budget: ~38,000 lbs
- Chest cap (per session): 12 sets
- Shoulders cap: 10 sets
- Triceps cap: 10 sets

---

## Scenario 1: Realistic Hard Session (Rule B2 — Per-Muscle-Group Session Cap)

**Workout:**
- 6 × 225 × 8 bench (chest/triceps/shoulders)
- 4 × 185 × 10 incline DB (chest/triceps/shoulders)
- 4 × 80 × 12 lateral raise (shoulders)
- 4 × 50 × 12 tricep pushdown (triceps)

**Expected Set Count per Muscle Group:**
- Chest: 6 + 4 = 12 sets (AT LIMIT ✓)
- Triceps: 6 + 4 + 4 = 14 sets (OVER by 4)
- Shoulders: 6 + 4 + 4 = 14 sets (OVER by 4)

**Expected Outcome:**
- ❌ **Rule B2 fires:** "shoulders: 14 sets past realistic limit 10"
- User must adjust (remove 4 shoulder sets) before save
- After trim to 10 shoulder sets: should save cleanly

**Verify:**
- [ ] Warning appears on first save attempt
- [ ] Correct muscle group name in warning
- [ ] Correct counts (14 and 10)
- [ ] Clamp works: trim shoulder sets to 10 and re-save succeeds

---

## Scenario 2: Volume Budget Ceiling (Rule B4 — Daily Total Volume)

**Workout A (First Session, Day 1):**
- Multiple heavy exercises totaling 23,000 lbs volume
- Should save cleanly

**Workout B (Second Session, Same Day):**
- Multiple heavy exercises totaling 22,000 lbs volume
- Combined: 45,000 lbs (over 38,000 budget)

**Expected Outcome:**
- ✓ First save succeeds
- ❌ **Rule B4 fires on second save:** "Total volume today (45000 lbs) is past the realistic daily ceiling (38000 lbs)"
- User must either delete first session or reduce second session

**Verify:**
- [ ] First save succeeds
- [ ] Second save on same date fires B4 warning
- [ ] Correct volume numbers in warning
- [ ] Warning mentions "daily ceiling"

---

## Scenario 3: Cardio Cross-Modality Penalty (Rule B4 — Cardio Reduces Budget)

**Cardio Session:**
- 60 minutes moderate effort (any cardio type)

**Strength Session (Same Day):**
- Multiple exercises totaling 35,000 lbs

**Penalty Calculation:**
- Cardio minutes: 60
- Penalty: min(0.40, (60/30) × 0.10) = min(0.40, 0.20) = 0.20 (20%)
- Adjusted budget: 38,000 × (1 - 0.20) = **30,400 lbs**
- Session volume 35,000 > 30,400 → **Rule B4 fires**

**Expected Outcome:**
- ✓ Cardio logs cleanly
- ❌ Strength session triggers B4 warning
- Warning shows reduced budget accounting for cardio

**Verify:**
- [ ] Cardio saves without issues
- [ ] Strength session fires B4 on same date
- [ ] Budget in warning is ~30,400 lbs (reduced from 38,000)
- [ ] Warning context mentions cardio impact

---

## Scenario 4: "Cheese Path" — Multiple Exercises, Same Muscle Group (Rule B2)

**Workout (Single Session):**
- 6 × 225 × 8 bench (chest)
- 4 × 185 × 10 incline DB (chest)
- 3 × 155 × 12 dips (chest)
- 3 × 100 × 12 pec deck (chest)
- **Total: 16 chest sets** (cap is 12)

**Expected Outcome:**
- ❌ **Rule B2 fires:** "chest: 16 sets past realistic limit 12"
- Cannot save until reduced to ≤12 chest sets

**Verify:**
- [ ] B2 warning fires immediately
- [ ] User must remove 4+ chest sets
- [ ] Trim to 12 and re-save succeeds

---

## Scenario 5: Older User Demographics (Age × 0.90 Multiplier)

**Test User Profile:**
- Age: 55M (vs. 25M baseline)
- Weight: 200 lbs
- Height: 6'2"

**Expected Adjustments:**
- Multiplier: 0.90 (age 55 bucket)
- Daily budget: 38,000 × 0.90 = **~34,200 lbs** (down 25% from 38k)
- Muscle-group caps: all reduced by 10% (e.g., chest 12 → ~10.8 sets, effective floor 3)

**Workout:**
- Log session with 33,000 lbs volume (would pass for 25yo, should pass for 55yo at 34.2k budget)
- Log session with 34,500 lbs volume (should fire B4 for 55yo)

**Expected Outcome:**
- ✓ 33,000 lbs saves cleanly for both ages
- ❌ 34,500 lbs fires B4 for 55yo (over 34.2k) but would pass for 25yo (under 38k)

**Verify:**
- [ ] Create 55yo test user
- [ ] Same session passes for 25yo, fails for 55yo
- [ ] Budget amounts are proportionally reduced

---

## Scenario 6: Missing/Empty Muscle Groups (No Crash Condition)

**Workout:**
- Exercise with **no muscle_groups field** (or empty array)
- 6 × 225 × 8 reps
- Other normal exercises below caps

**Expected Outcome:**
- ✓ Saves cleanly (Rule B2 skips exercises with no groups)
- No crash; graceful fallback

**Verify:**
- [ ] Exercise with missing `muscle_groups` doesn't block save
- [ ] No console errors
- [ ] Volume still counts toward daily budget (Rule B4)

---

## Summary

| Rule | Trigger | Expected Test Result |
|------|---------|---------------------|
| **B2** | Per-muscle-group session cap exceeded | Scenario 1, 4 → warnings fire |
| **B4** | Daily total volume exceeds budget | Scenario 2, 3 → warnings fire |
| **Cardio Penalty** | Concurrent cardio reduces strength budget | Scenario 3 → reduced budget triggers warning |
| **Age Multiplier** | Older users = lower caps & budget | Scenario 5 → tighter limits for 55yo |
| **Graceful Degradation** | No muscle group data | Scenario 6 → no crash, saves cleanly |

---

## How to Test

1. **Create test user** with specified demographics (25M, 190 lbs, 6'2")
2. **Log Scenario 1 workout** → expect B2 warning on shoulders
3. **Log Scenario 2 workouts** → expect B4 warning on second save
4. **Log Scenario 3 cardio + strength** → expect B4 warning accounting for cardio
5. **Log Scenario 4 workout** → expect B2 warning on chest
6. **Create 55yo user** and repeat Scenario 2 → verify tighter budget
7. **Log Scenario 6 exercise** → verify no crash on empty `muscle_groups`

**Success Criteria:**
- ✅ All warnings fire at the correct thresholds
- ✅ Correct muscle groups and set counts in messages
- ✅ Budget calculations account for age and cardio
- ✅ No crashes or edge-case failures
- ✅ After dismissing warning and trimming sets, second save succeeds