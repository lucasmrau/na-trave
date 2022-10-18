import { format } from "date-fns";
import { useFormik } from "formik";
import { FormEvent } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import * as yup from 'yup'
import { api } from "../services/api";

interface ScoreboardCardProps {
  game: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    gameTime: string;
  },
  awayTeamScore?: number | string;
  homeTeamScore?: number | string;
  isProfilePage?: boolean;
  currentDate?: Date;
}

const validationSchema = yup.object({
  homeTeamScore: yup.number().required('Favor, preencher placar do time da casa!'),
  awayTeamScore: yup.number().required('Favor, preencher placar do time visitante!'),
})

export function ScoreboardCard({ game, awayTeamScore, homeTeamScore, isProfilePage, currentDate }: ScoreboardCardProps) {
  const formatHour = format(new Date(game.gameTime), "H':'mm")
  const [cookies] = useCookies(['natrave.token']);
  
  const formik = useFormik({
    onSubmit: async (data) => {
      try {
        toast.promise(
          handleSendHunch(Number(data.awayTeamScore), Number(data.homeTeamScore) , game.id),
          {
            pending: 'Gravando palpite',
            success: 'Palpite Salvo ⚽',
            error: 'Erro ao gravar palpite 😢'
          }
        )
        
      } catch (error) {
        formik.setStatus('Erro ao gravar palpite!')
      }
    },
    validationSchema,
    validateOnMount: true,
    initialValues: {
      homeTeamScore: homeTeamScore ? homeTeamScore : '',
      awayTeamScore: awayTeamScore ? awayTeamScore : '',
    }
  })

  async function handleSendHunch(awayTeamScore: number, homeTeamScore: number, gameId: string) {
    await api.post('/hunch', {
      gameId,
      awayTeamScore,
      homeTeamScore
    }, {
      headers: {
        Authorization: `Bearer ${cookies['natrave.token']}`
      }
    })
  }

  
  return (
    <div className="flex flex-col p-4 md:px-8 md:py-5 items-center justify-center border border-gray-300 rounded-2xl">
      <p className="text-xs md:text-base mb-4">{formatHour}</p>

      <div className="flex items-center justify-center w-full gap-5 md:gap-6">
        <div className="flex gap-2 items-center">
          <p className="text-sm md:text-base uppercase">{game.homeTeam}</p>
          <img src={`/flags/${game.homeTeam}.png`} className="w-8 md:w-10" />
        </div>

        <form onSubmit={formik.handleSubmit} className="flex gap-2 items-center">
          <input 
            type="number" 
            min={0}
            name="homeTeamScore"
            disabled={isProfilePage || currentDate && currentDate < new Date()}
            value={formik.values.homeTeamScore}
            onChange={formik.handleChange}
            onBlur={e => formik.handleSubmit(e.target.value as unknown as FormEvent<HTMLFormElement>)}
            className={`text-center bg-red-300/[0.15] w-8 md:w-10 h-8 md:h-10 text-red-300 font-bold placeholder:text-red-300 disabled:cursor-not-allowed ${formik.touched.homeTeamScore && formik.errors.homeTeamScore && "border-red-500 border-2"}`}
          />
          <strong className="font-bold text-red-300">X</strong>
          <input 
            type="number" 
            min={0}
            name="awayTeamScore"
            disabled={isProfilePage || currentDate && currentDate < new Date()}
            value={formik.values.awayTeamScore}
            onChange={formik.handleChange}
            onBlur={e => formik.handleSubmit(e.target.value as unknown as FormEvent<HTMLFormElement>)}
            className={`text-center bg-red-300/[0.15] w-8 md:w-10 h-8 md:h-10 text-red-300 font-bold placeholder:text-red-300 disabled:cursor-not-allowed ${formik.touched.awayTeamScore && formik.errors.awayTeamScore && "border-red-500 border-2"}`}
          />
        </form>

        <div className="flex gap-2 items-center">
          <img src={`/flags/${game.awayTeam}.png`} className="w-8 md:w-10" />
          <p className="text-sm md:text-base uppercase">{game.awayTeam}</p>
        </div>
      </div>
      <div className="flex flex-col  mt-4 gap-2">
        {formik.touched.homeTeamScore && formik.errors.homeTeamScore && <p className="text-red-500 text-sm">{formik.errors.homeTeamScore}</p> }
        {formik.touched.awayTeamScore && formik.errors.awayTeamScore && <p className="text-red-500 text-sm">{formik.errors.awayTeamScore}</p> }
      </div>

    </div>
  )
}