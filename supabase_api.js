// Supabase configuration

export const SUPABASE_URL = 'https://ysiydkdjavfaybihusbz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzaXlka2RqYXZmYXliaWh1c2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTI0NjksImV4cCI6MjA1NzIyODQ2OX0.FBt7QKfPFZ0BPX7RJ-t_2gE6twXo-O33dydGwlUl5vg';


// Function to submit score
export async function submitScore(playerName, score, missionNumber, sectorIndex) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                player_name: playerName,
                score: score,
                mission_number: missionNumber,
                sector_index: sectorIndex
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error submitting score:', error);
        return false;
    }
}

// Function to get top scores
export async function getTopScores(limit = 10) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=score.desc&limit=${limit}`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
} 