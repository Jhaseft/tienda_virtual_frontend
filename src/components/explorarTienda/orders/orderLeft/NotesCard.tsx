interface Props {
  notes: string
}

export default function NotesCard({ notes }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
      <p className="text-[16px] font-bold text-gray-800 mb-1">Notas</p>
      <p className="text-sm text-gray-600 leading-relaxed">{notes}</p>
    </div>
  )
}
