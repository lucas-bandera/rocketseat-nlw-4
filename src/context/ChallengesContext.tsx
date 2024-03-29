import { createContext, useState, ReactNode, useEffect } from 'react'
import challenges from '../../challenges.json'

import Cookies from 'js-cookie'
import { LevelUpModal } from '../components/LevelUpModal'

interface ChallengesContextData {
    level: number
    currentExp: number
    challengesCompleted: number
    activeChallenge: null | ActiveChallengeState
    experienceToNextLevel: number
    levelUp: () => void
    startNewChallenge: () => void
    resetChallenge: () => void
    completeChallenge: () => void
}

interface ChallengesProviderProps {
    level: number
    currentExp: number
    challengesCompleted: number
    children: ReactNode
}

interface ActiveChallengeState {
    type: string
    description: string
    amount: number
}

export const ChallengesContext = createContext({} as ChallengesContextData)


export const ChallengesProvider = ({children, ...rest}: ChallengesProviderProps) => {
    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExp, setCurrentExp] = useState(rest.currentExp ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)
    const [activeChallenge, setActiveChallenge] = useState<null|ActiveChallengeState>(null)

    const experienceToNextLevel = Math.pow((level + 1) * 4 , 2)

    useEffect(() => {
        Notification.requestPermission()
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExp', String(currentExp))
        Cookies.set('challengesCompleted', String(challengesCompleted))
    }, [level, currentExp, challengesCompleted])
    

    const levelUp = () => {
        setLevel(level => level + 1)
    }

    const startNewChallenge = () => {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        if(Notification.permission === 'granted') {
            new Notification('Novo desafio 🎉', {
                body: `Valendo ${challenge.amount} xp`
            })
        }
    }

    const resetChallenge = () => {
        setActiveChallenge(null)
    }

    const completeChallenge = () => {
        if(!activeChallenge) { return }

        const { amount } = activeChallenge
        let finalExperience = currentExp + amount

        if(finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp()
        }

        setCurrentExp(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(completed => completed + 1)
    }



    return (
        <ChallengesContext.Provider value={
            {
                level, 
                levelUp, 
                currentExp, 
                challengesCompleted, 
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                experienceToNextLevel,
                completeChallenge
            }
        }>
            {children}

            <LevelUpModal />
        </ChallengesContext.Provider>
    )
}