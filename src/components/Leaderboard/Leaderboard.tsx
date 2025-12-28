import styles from './Leaderboard.module.css';
import LeaderboardItem from './LeaderboardItem';

type BadgeType = 'primary' | 'danger' | 'warning' | 'light';

const Leaderboard = () => {
const topSchools = [
{
    rank: 1,
    name: 'MAN Insan Cendekia OKI',
    location: 'Ogan Komering Ilir, Sumatera Selatan',
    score: 5000,
    badge: 'primary'
},
{
    rank: 2,
    name: 'SMAN 1 Jakarta',
    location: 'Jakarta Pusat',
    score: 4852,
    badge: 'danger'
},
{
    rank: 3,
    name: 'SMAN 3 Bandung',
    location: 'Bandung',
    score: 3987,
    badge: 'warning'
},
{
    rank: 4,
    name: 'SMPN 2 Yogyakarta',
    location: 'Yogyakarta',
    score: 3654,
    badge: 'light'
},
{
    rank: 5,
    name: 'SMAN 1 Medan',
    location: 'Medan',
    score: 3421,
    badge: 'light'
}
];

const topContributors = [
{
    rank: 1,
    name: 'Ality Qahar Putra Dito',
    school: 'MAN Insan Cendekia OKI',
    points: 285,
    badge: 'primary'
},
{
    rank: 2,
    name: 'Andy Pramono',
    school: 'MAN Insan Cendekia OKI',
    points: 267,
    badge: 'danger'
},
{
    rank: 3,
    name: 'Budi Santoso',
    school: 'SMAN 1 Jakarta',
    points: 243,
    badge: 'warning'
},
{
    rank: 4,
    name: 'Rina Dewi',
    school: 'SMAN 3 Bandung',
    points: 231,
    badge: 'light'
},
{
    rank: 5,
    name: 'Doni Pratama',
    school: 'SMPN 2 Yogyakarta',
    points: 218,
    badge: 'light'
}
];

return (
<section id="leaderboard" className={styles.leaderboardSection}>
    <div className={styles.container}>
    <div className={styles.header}>
        <h2 className={styles.title}>Eco-Champion Leaderboard</h2>
        <p className={styles.subtitle}>Sekolah dengan kontribusi terbaik untuk lingkungan</p>
    </div>

    <div className={styles.leaderboardGrid}>
        {/* Top Eco-Schools */}
        <div className={styles.leaderboardColumn}>
        <div className={styles.leaderboard}>
            <h4 className={styles.leaderboardTitle}>
            <span className={styles.trophy}>🏆</span> Top Eco-Schools
            </h4>

            {/* use LeaderboardItem */}
            {topSchools.map((s) => (
            <LeaderboardItem
                key={s.rank}
                rank={s.rank}
                title={s.name}
                subtitle={s.location}
                value={s.score}
                valueLabel="Eco-Score"
                badge={s.badge as BadgeType}
            />
            ))}
        </div>
        </div>

        {/* Top Contributors */}
        <div className={styles.leaderboardColumn}>
        <div className={styles.leaderboard}>
            <h4 className={styles.leaderboardTitle}>
            <span className={styles.star}>🌟</span> Top Contributors
            </h4>

            {topContributors.map((c) => (
            <LeaderboardItem
                key={c.rank}
                rank={c.rank}
                title={c.name}
                subtitle={c.school}
                value={c.points}
                valueLabel="Eco-Points"
                badge={c.badge as BadgeType}
            />
            ))}
        </div>
        </div>
    </div>
    </div>
</section>
);
};

export default Leaderboard;