export type RegionResponse = {
  heading: string
  items: string[]
}

export type RegionApiResponse = {
  data: RegionResponse[]
}

export async function fetchRegionData(): Promise<RegionApiResponse> {
  const res = await fetch('/region.json')

  if (!res.ok) {
    throw new Error('Failed to fetch region data')
  }

  return res.json()
}
