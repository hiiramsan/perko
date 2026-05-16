import { cn } from "@/lib/utils"
import { Marquee } from "../ui/marquee"

const reviews = [
  {
    name: "Isabel Rodriguez",
    title: "Duena, Tostadores Luna",
    body:
      "Perko es una parte importante de mi negocio. Las visitas repetidas subieron y a los clientes les encantan las recompensas.",
    img: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Marcos Lopez",
    title: "Lider de marketing, Harbor Fitness",
    body:
      "Los miembros ganan puntos en cada clase. Recuperamos clientes sin bajar los precios ni la marca.",
    img: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Lucia Torres",
    title: "Fundadora, Bloom Skincare",
    body:
      "Las tarjetas de fidelidad se sienten premium y coherentes con la marca. El ticket promedio subio despues del lanzamiento.",
    img: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Diego Alvarez",
    title: "Gerente general, Bistro El Camino",
    body:
      "A los clientes les encanta ganar recompensas en la caja. Convirtio visitas ocasionales en clientes habituales.",
    img: "https://i.pravatar.cc/100?img=15",
  },
  {
    name: "Sofia Mendez",
    title: "Directora de marca, Mercado Oak Street",
    body:
      "Creamos un programa de lealtad sin una configuracion larga. Las tarjetas de sellos impulsan el regreso de clientes.",
    img: "https://i.pravatar.cc/100?img=56",
  },
  {
    name: "Andres Navarro",
    title: "Operaciones, Northside Barbers",
    body:
      "Los clientes recuerdan volver porque las recompensas son claras y faciles de seguir.",
    img: "https://i.pravatar.cc/100?img=21",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  title,
  body,
}: {
  img: string
  name: string
  title: string
  body: string
}) => { 
  return (
    <figure
      className={cn(
        "relative flex h-full w-72 max-w-[85vw] cursor-pointer flex-col overflow-hidden rounded-2xl border p-5 shadow-sm",
        "border-blue-400/40 bg-slate-50/80 text-slate-800",
        "hover:bg-white/80 hover:border-blue-400/80"
      )}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 717 627"><path fill="#05668D" d="m306 106l-26-40C100 187 0 334 0 455c0 117 86 172 159 172c92 0 157-78 157-160c0-69-44-128-103-150c-17-6-33-11-33-40c0-37 27-92 126-171zm397 0l-26-40C499 187 397 334 397 455c0 117 88 172 161 172c93 0 159-78 159-160c0-69-45-128-106-150c-17-6-32-11-32-40c0-37 28-92 124-171z"/></svg>
      <blockquote className="mt-4 text-sm leading-relaxed text-slate-700">
        {body}
      </blockquote>
      <div className="mt-auto flex items-center gap-3 pt-5">
        <img
          className="h-10 w-10 rounded-full object-cover"
          width="40"
          height="40"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-slate-900">
            {name}
          </figcaption>
          <p className="text-xs text-slate-500">{title}</p>
        </div>
      </div>
    </figure>
  )
}

export function MarqueeVertical() {
  return (
    <div className="relative flex h-120 w-full items-center justify-center overflow-hidden sm:h-140">
      <Marquee pauseOnHover vertical className="[--duration:22s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        vertical
        className="hidden sm:flex [--duration:22s]"
      >
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b"></div>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
    </div>
  )
}
