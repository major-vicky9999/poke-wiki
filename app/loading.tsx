import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Image
        src='/loading.jpg'
        width={1920}
        height={1080}
        alt="bg"
        className="w-screen h-screen object-cover fixed top-0 left-0 -z-10"
      />
      <span className="font-black uppercase text-5xl text-center px-5 pt-3 m-0 text-rosePine-love bg-rosePine-base bg-opacity-50 rounded-xl">Loading...</span>
    </div>
  )
}
