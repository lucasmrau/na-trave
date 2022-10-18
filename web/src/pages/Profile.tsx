import { CircleNotch } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { DateSelect } from "../components/DateSelect";
import { Header } from "../components/Header";
import { IconBack } from "../components/IconBack";
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

type Hunch = {
  id: string;
  homeTeamScore: number;
  awayTeamScore: number;
}

export function Profile() {
  const initialDate = new Date(2022, 10, 20)
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [isLoading, setIsLoading] = useState(false)
  const [games, setGames] = useState<Game[]>()
  const [hunches, setHunches] = useState<Hunches>()

  const { username } = useParams<{ username: string }>()

  const hunch = hunches?.hunches.reduce((acc, hunch) => {
    acc[hunch.gameId] = hunch
    return acc
  }, {} as any[string])

  const { user, signOut } = useContext(AuthContext)
  const navigate = useNavigate();

  function onChangeDateSelect(date: Date) {
    setCurrentDate(date)
  }

  function handleSignOut() {
    signOut()

    navigate('/login') 
  }

  // useEffect(() => {
  //   if(!user) {
  //     navigate('/')
  //   }
  // }, [user])
  
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

    try {
      const response = await api.get<Hunches>(`/hunches/${username}`)
      setHunches(response.data)
    } catch (error) {
      console.log(error)
      navigate('*')
    }

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
          <Header logo="/logo-dashboard.svg" isProfilePage />
        </div>

        <div className="flex flex-col w-full h-36 px-5 md:px-0 py-4 md:py-4 gap-4 max-w-[600px]">
          <div className="flex">
            <Link to="/dashboard" className="text-white">
              <IconBack />
            </Link>
          </div>
          <h2 className="text-xl md:text-2xl font-bold">{hunches?.name}</h2>
        </div>
      </div>

      <div className="flex flex-col py-4 w-full max-w-[600px] px-5 md:px-0">
        {username === user?.username && 
          <>
          <div className="flex items-center justify-end">
            <button 
              className="text-xs md:text-sm font-bold hover:text-red-300"
              onClick={handleSignOut}
              title="Sair da minha conta"
            >
              Logout
            </button>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-red-300 mt-10">Your guesses</h2>
          </>
        }
       <DateSelect 
          initialDate={initialDate} 
          currentDate={currentDate}
          onChangeDateSelect={onChangeDateSelect}
        />

        <div className="flex flex-col p-4 md:px-0 gap-3 md:gap-4">
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
                      isProfilePage
                    />
                  )
                })}
              </div>       
              :
              <p className="text-center">There isn't matches to this date</p>
            }
        </div>
        
      </div>
    </div>
  )
}