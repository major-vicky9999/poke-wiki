"use client";
import Image from "next/image"
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftIcon, ArrowRightIcon, Search } from "lucide-react";
import { Skeleton } from "@/components/skeleton";

type ListType = {
  name: string,
  url: string
}
const perPageCount = 20;
export default function Page() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<ListType[]>([])
  const [input, setInput] = useState("")
  const [filteredData, setFilteredData] = useState<ListType[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  const fetchJSON = async (url: string) => {
    try {
      setPageLoading(true)
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setData(response.data.results)
      setFilteredData(response.data.results.slice(0, perPageCount));
      setPageLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setPageLoading(false)
    }
  }

  useEffect(() => { fetchJSON("https://pokeapi.co/api/v2/pokemon?limit=1302") }, [])

  const handleSearch = async () => {
    if (input === "") {
      setFilteredData([])
      alert("No Pokemon found")
      return
    }
    setFilteredData(data.filter(el => el.name.includes(input.toLowerCase())))
  }

  return (
    <>
      {pageLoading ?
        <div className="h-screen w-screen flex justify-center items-center">
          <Image
            src='/loading.jpg'
            width={1920}
            height={1080}
            alt="bg"
            className="w-screen h-screen object-cover fixed top-0 left-0 -z-10"
          />
          <span className="font-black uppercase text-5xl text-center px-5 pt-3 m-0 text-rosePine-love bg-rosePine-base bg-opacity-50 rounded-xl">Loading...</span>
        </div> :
        <div className="w-screen min-h-screen overflow-hidden bg-rosePine-surface" >
          <div className="w-screen h-36 bg-rosePine-base relative flex flex-col justify-center">
            <h1
              className="text-center bg-gradient-to-r from-rosePine-love via-rosePine-rose to-rosePine-love bg-clip-text md:text-6xl text-3xl font-extrabold uppercase text-transparent">
              POKE WIKI
            </h1>
            <input
              className="absolute left-1/2 -translate-x-1/2 bg-rosePineMoon-overlay bg-opacity-55 backdrop-blur-md -bottom-5 border-2 border-rosePine-muted h-12 w-[90vw] rounded-lg pl-10 text-rosePine-text"
              placeholder="Search Products...."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <Search className="absolute -bottom-3 left-[7vw] md:left-[5.5vw] stroke-rosePine-subtle" size={30} />
          </div>
          <div className="mt-10 flex justify-end px-10 gap-5">
            <button
              disabled={page <= 0}
              onClick={() => {
                if (page > 0) setPage(prev => prev - 1)
                setFilteredData(data.slice(page * perPageCount, (page + 1) * perPageCount));
              }}
              className="bg-rosePine-overlay p-3 text-rosePine-text rounded-md disabled:opacity-50">
              <ArrowLeftIcon className="" />
            </button>
            <button
              disabled={page >= 1302 / perPageCount}
              onClick={() => {
                if (page < 1302 / perPageCount) setPage(prev => prev + 1)
                setFilteredData(data.slice((page + 1) * perPageCount, (page + 2) * perPageCount));
              }}
              className="bg-rosePine-overlay p-3 text-rosePine-text rounded-md disabled:opacity-50">
              <ArrowRightIcon className="" />
            </button>
          </div>
          <div className="my-5 px-5 gap-5 grid grid-cols-1 md:grid-cols-4">
            {filteredData.map((pokemon) =>
              <DataCard key={pokemon.name} pokemon={pokemon} />
            )}
          </div >
        </div>
      }</>
  );
}
function toSentenceCase(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



type PokeCardType = {
  id: number,
  sprites: {
    front_default: string
  },
  types: {
    slot: number,
    type: { name: string, url: string }
  }[],
  name: string
}
const DataCard = ({ pokemon }: { pokemon: { name: string, url: string } }) => {
  const [data, setData] = useState<PokeCardType>({
    id: 0,
    sprites: {
      front_default: "",
    },
    types: [],
    name: "",
  })
  const [loading, setLoading] = useState(true)

  const fetchJSON = async (url: string) => {
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false)
    }
  }

  useEffect(() => { fetchJSON(pokemon.url) }, [pokemon.url])
  return (
    <>
      {loading ? <Skeleton className="w-full h-[50vh] md:h-[25vw] bg-rosePine-overlay" /> :
        <div className="text-rosePine-text bg-rosePine-base bg-opacity-30 backdrop-blur-md rounded-md p-5 text-2xl ">
          <Image
            src={data?.sprites?.front_default || ""}
            width={300}
            height={300}
            alt="bg"
            className="bg-rosePine-base rounded-xl mx-auto"
          />
          <p className="pl-10 py-2 text-lg">#{data.id?.toString().padStart(4, '0')}</p>
          <p className="font-black text-2xl pl-5">{toSentenceCase(data.name)}</p>
          <div className="flex gap-2 mx-5">
            {data.types.map(type => <Badge type={type.type.name} key={type.slot} />)}
          </div>
        </div>}
    </>
  )
}

const Badge = ({ type }: { type: string }) => {
  return (
    <div
      style={{
        background:
          type == "grass" ? "#3C872B" :
            type == "normal" ? "#565B5D" :
              type == "fire" ? "#AA1617" :
                type == "fighting" ? "#C56402" :
                  type == "water" ? "#0F53A9" :
                    type == "flying" ? "#114374" :
                      type == "poison" ? "#6B2C96" :
                        type == "electric" ? "#C29503" :
                          type == "ground" ? "#774620" :
                            type == "psychic" ? "#A21641" :
                              type == "rock" ? "#565139" :
                                type == "ice" ? "#1286A2" :
                                  type == "bug" ? "#78841B" :
                                    type == "dragon" ? "#1E2A92" :
                                      type == "ghost" ? "#5C375A" :
                                        type == "dark" ? "#50403F" :
                                          type == "steel" ? "#1C1E1E" :
                                            type == "fairy" ? "#831381" :
                                              type == "steller" ? "#358D80" : ""
      }}
      className="rounded-full px-3 pt-1 text-lg flex items-center">
      <div className="mr-2" >
        <Image
          src={`/types/${type.substring(0, 3)}.png`}
          width={20}
          height={20}
          className="relative"
          alt="bg"
        />
      </div>
      <span> {toSentenceCase(type)} </span>
    </div>
  )
}
