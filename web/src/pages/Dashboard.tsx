import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleNotch } from "phosphor-react";
import { DateSelect } from "../components/DateSelect";
import { Header } from "../components/Header";
import { ScoreboardCard } from "../components/ScoreboardCard";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/api";

type Game = {
  id: string;
  awayTeam: string;
  gameTime: string;
  homeTeam: string;
}

type Hunches = {
  name: string;
  hunches: {
    id: string;
    homeTeamScore: number;
    awayTeamScore: number;
    gameId: string;
  }[]
}

export function Dashboard() {
  const initialDate = new Date(2022, 10, 20)

  const [games, setGames] = useState<Game[]>()
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [isLoading, setIsLoading] = useState(false)
  const [hunches, setHunches] = useState<Hunches>()

  const { user } = useContext(AuthContext)
  const [firstName, lastName] = user ? user.name.split(" ") : ""
  const navigate = useNavigate();

  const hunch = hunches?.hunches.reduce((acc, hunch) => {
    acc[hunch.gameId] = hunch
    return acc
  }, {} as any[string])

  function onChangeDateSelect(date: Date) {
    setCurrentDate(date)
  }

  useEffect(() => {
    if(!user) {
      navigate('/')
    }
  }, [user])

  async function getAllGames() {
    const response = await api.get<Game[]>('/games', {
      params: {
        gameTime: currentDate.toISOString()
      }
    })
    setGames(response.data)
  }

  async function getAllHunches() {
    setIsLoading(true)

    const response = await api.get<Hunches>(`/hunches/${user?.username}`)
    setHunches(response.data)

    setIsLoading(false)
  }
  
  useEffect(() => {
    getAllGames()
  }, [currentDate])
  
  useEffect(() => {
    getAllHunches()
  }, [])

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col w-full bg-red-500 items-center justify-center text-white">
        <div className="w-full max-w-[600px] px-5 md:px-0">
          <Header logo="/logo-dashboard.svg" isDashboardPage />
        </div>

        <div className="flex flex-col w-full h-36 px-5 md:px-0 py-4 md:py-4 gap-4 max-w-[600px]">
          <p>Hello, {firstName}</p>
          <h2 className="text-2xl font-bold">What is tour guess?</h2>
        </div>
      </div>

      <div className="flex flex-col py-4 w-full max-w-[600px] px-5 md:px-0 gap-4">
        <DateSelect 
          initialDate={initialDate} 
          currentDate={currentDate}
          onChangeDateSelect={onChangeDateSelect}
        />

        <div className="flex flex-col">
          {isLoading ? 
            <CircleNotch 
              size={32}
              weight="bold" 
              className="animate-spin text-red-300 mx-auto" 
            /> 
            : 
            games && games.length > 0 ? 
              <div className="flex flex-col gap-3 md:gap-4">
                {games?.map(game => {
                  return (
                    <ScoreboardCard 
                      key={game.id} 
                      game={game} 
                      homeTeamScore={hunch[game.id]?.homeTeamScore === 0 ? '0' : hunch[game.id]?.homeTeamScore || ''} 
                      awayTeamScore={hunch[game.id]?.awayTeamScore === 0 ? '0': hunch[game.id]?.awayTeamScore || ''} 
                      currentDate={currentDate}
                    />
                  )
                })}
              </div>       
              :
              <p className="text-center">There isn't matches to the selected date.</p>
            }

        </div>
        
      </div>
    </div>
  )
}