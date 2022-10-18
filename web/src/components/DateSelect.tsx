
import { addDays, subDays, format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useState } from "react";
import { IconArrowLeft } from './IconArrowLeft';
import { IconArrowRight } from './IconArrowRight';

interface DateSelectProps {
  initialDate: Date;
  currentDate: Date;
  onChangeDateSelect: (date: Date) => void;
}

export function DateSelect({ initialDate, currentDate, onChangeDateSelect }: DateSelectProps) {
  const finalDate = new Date(2022, 11, 18)
  const formatDate = format(currentDate, "dd' de 'MMMM", {
    locale: ptBR
  })

  function prevDay() {
    const prevDate = subDays(currentDate, 1)

    if(prevDate <= initialDate) {
      onChangeDateSelect(initialDate)

      return
    }

    onChangeDateSelect(prevDate)
  }

  function nextDay() {
    const nextDate = addDays(currentDate, 1)

    if(nextDate >= finalDate) {
      onChangeDateSelect(finalDate)

      return
    }
    
    onChangeDateSelect(nextDate)
  }

  return (
    <div className="flex p-4 gap-8 text-red-300 items-center justify-center">
      <button onClick={prevDay}>
        <IconArrowLeft />
      </button>
      <strong className="text-black">{formatDate}</strong>
      <button onClick={nextDay}>
        <IconArrowRight />
      </button>
    </div>
  )
}