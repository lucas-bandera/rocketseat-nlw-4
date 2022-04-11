import styles from './styles.module.sass'

export const Profile = () => {
    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/LucasBandeira-MJ.png" alt="Lucas Bandeira" />
            <div>
                <strong>Lucas Bandeira</strong>
                <p>Level 1</p>
            </div>
        </div>
    )
}