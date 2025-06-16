export default function RegionItemPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">This is: {params.id}</h1>
    </div>
  )
}
