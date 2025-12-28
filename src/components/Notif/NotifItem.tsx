import styles from './Notif.module.css';

type Props = {
    title: string;
    deadline: string;
    isRead?: boolean;
    onClick?: () => void;
};

export default function NotifItem({ title, deadline, isRead = false, onClick }: Props) {
    return (
        <div 
            className={styles.notifItem}
            onClick={onClick}
            style={{
                opacity: isRead ? 0.6 : 1,
                position: 'relative',
                cursor: onClick ? 'pointer' : 'default'
            }}
        >
            {!isRead && (
                <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '10px',
                    height: '10px',
                    background: '#ef5350',
                    borderRadius: '50%',
                    border: '2px solid white'
                }} />
            )}
            <span className={styles.title}>{title}</span>
            {deadline && <span className={styles.deadline}>{deadline}</span>}
        </div>
    );
}