import type { DayExtra, GalleryImage, TravelSuggestion } from "../types/travel";

const maps = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const commons = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1800`;

const suggestion = (
  title: string,
  description: string,
  priceHint?: string,
  mapQuery?: string,
  sourceUrl?: string,
): TravelSuggestion => ({
  title,
  description,
  priceHint,
  mapsUrl: mapQuery ? maps(mapQuery) : undefined,
  sourceUrl,
});

const photo = (fileName: string, title: string, credit = "Wikimedia Commons"): GalleryImage => ({
  url: commons(fileName),
  alt: title,
  title,
  credit,
  sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replaceAll("%20", "_")}`,
});

const kyotoDining = [
  suggestion("Gion Yorozuya", "Udon con abundante Kujo negi cerca de Yasaka; buena opción tradicional y relativamente directa.", "¥¥", "Gion Yorozuya Kyoto"),
  suggestion("Gion Tsujiri", "Parfait, helado y bebidas de matcha; funciona como pausa dulce más que como comida completa.", "¥¥", "Gion Tsujiri Kyoto"),
];
const kyotoFood = [
  suggestion("Yudōfu / tofu de Kyoto", "Tofu suave y preparaciones de yuba: sabores ligeros que encajan bien después de caminar por templos.", "¥–¥¥"),
  suggestion("Matcha + wagashi", "Té Uji con dulces japoneses; probarlo al menos una vez en Kyoto/Uji.", "¥"),
];
const kyotoShopping = [
  suggestion("Yatsuhashi", "Dulce clásico de Kyoto, fácil de transportar; compra una caja pequeña para decidir si vale la pena llevar más.", "¥"),
  suggestion("Té Uji / matcha", "Mejor recuerdo consumible del área; prioriza tiendas especializadas y revisa fecha de molienda.", "¥–¥¥"),
];

const tokyoFood = [
  suggestion("Sushi estilo Edomae", "Pescado y arroz avinagrado al estilo Tokyo; ideal en Asakusa/Toyosu o una barra de barrio.", "¥¥"),
  suggestion("Ramen", "Tokyo tiene estilos muy distintos; úsalo como comida rápida entre barrios.", "¥–¥¥"),
];
const tokyoShopping = [
  suggestion("Gashapon / merch oficial", "Compra solo personajes o franquicias que realmente coleccionen; compara precio antes de comprar reventa.", "¥–¥¥"),
  suggestion("Papelería japonesa", "Libretas, bolígrafos y sellos ocupan poco equipaje y suelen ser mejores recuerdos prácticos.", "¥–¥¥"),
];

export const extrasByDay: Record<string, DayExtra> = {
  "2026-12-06": {
    food: [
      suggestion("Desayuno sencillo antes del vuelo", "Algo conocido y liviano en MDE/BOG; el objetivo es evitar experimentar antes de dos vuelos largos.", "COP $$"),
      suggestion("Comida de vuelo + hidratación", "Lleva agua después de seguridad y snack seco por si los horarios de servicio no coinciden con hambre.", "—"),
    ],
    shopping: [
      suggestion("Adaptador universal / cable extra", "Solo si falta en el equipaje. Es mejor resolverlo antes de salir de Colombia.", "COP $"),
      suggestion("Nada de duty free todavía", "Evitar cargar compras durante cuatro tramos internacionales.", "—"),
    ],
    dining: [
      suggestion("Zona de restaurantes de El Dorado", "Usar la conexión para comer algo antes del vuelo transatlántico, sin salir del aeropuerto.", "COP $$", "El Dorado Airport restaurants Bogotá"),
    ],
    gallery: [photo("El_Dorado_International_Airport_Bogota.jpg", "Aeropuerto El Dorado · Bogotá")],
    note: "Día de tránsito: las sugerencias priorizan logística y descanso.",
  },
  "2026-12-07": {
    food: [
      suggestion("Bocadillo / tortilla en Madrid", "Una comida española sencilla durante la escala larga, sin alejarse del aeropuerto.", "€"),
      suggestion("Snack para el vuelo a Beijing", "Comprar algo no perecedero antes de embarcar por si el horario de comida no coincide.", "€"),
    ],
    shopping: [
      suggestion("SIM/eSIM solo si hace falta", "No comprar por impulso en aeropuerto si ya tienen roaming/eSIM preparada.", "€–€€"),
      suggestion("Evitar compras grandes", "Todavía faltan Beijing y Osaka; mantener equipaje ligero.", "—"),
    ],
    dining: [
      suggestion("Restauración de MAD T4/T1", "Elegir según la terminal efectiva tras el self-transfer; confirmar puerta antes de sentarse.", "€€", "Madrid Barajas Airport restaurants"),
    ],
    gallery: [photo("Madrid_Barajas_International_Airport_T4.jpg", "Madrid-Barajas · Terminal 4")],
    note: "La escala es larga, pero sigue siendo un día de conexión; no convertirla en excursión improvisada.",
  },
  "2026-12-08": {
    food: [...kyotoFood],
    shopping: [
      suggestion("ICOCA", "Tarjeta IC útil para transporte urbano y compras pequeñas; comprar al llegar si no usan versión móvil.", "¥"),
      ...kyotoShopping.slice(0, 1),
    ],
    dining: [
      suggestion("Wagyu Sukiyaki Kyoto Chikarayama", "Cerca de Kyoto Station; opción cómoda para una primera cena japonesa con sukiyaki/shabu-shabu.", "¥¥¥", "Wagyu Sukiyaki Kyoto Chikarayama Kyoto Station"),
      ...kyotoDining.slice(0, 1),
    ],
    gallery: [
      photo("Gion_Kyoto_Japan.jpg", "Gion · Kyoto"),
      photo("Yasaka_Shrine_Kyoto.jpg", "Yasaka Shrine · Kyoto"),
    ],
  },
  "2026-12-09": {
    food: kyotoFood,
    shopping: kyotoShopping,
    dining: [
      suggestion("Kasagiya", "Dulces tradicionales cerca de Sannenzaka; buena pausa entre Kiyomizu y las calles históricas.", "¥¥", "Kasagiya Kyoto"),
      ...kyotoDining,
    ],
    gallery: [
      photo("Kiyomizu-dera_in_Kyoto-r.jpg", "Kiyomizu-dera"),
      photo("Kyoto_from_Kiyomizu-Dera.jpg", "Vista de Kyoto desde Kiyomizu-dera"),
      photo("Yasaka_Pagoda_Kyoto.jpg", "Yasaka Pagoda · Higashiyama"),
    ],
  },
  "2026-12-10": {
    food: [
      suggestion("Matcha Uji", "Pedir matcha preparado o un parfait; Uji es el día para probar té en origen.", "¥–¥¥"),
      suggestion("Cha-soba", "Fideos de soba con té; opción temática y ligera antes de Nintendo/Fushimi.", "¥¥"),
    ],
    shopping: [
      suggestion("Té Uji de hoja / matcha", "Comprar una lata pequeña en Uji, no una bolsa gigante hasta saber qué perfil les gusta.", "¥–¥¥"),
      suggestion("Merch Nintendo Museum", "Priorizar piezas exclusivas del museo y evitar duplicar productos disponibles en Nintendo Tokyo.", "¥–¥¥¥"),
    ],
    dining: [
      suggestion("Nakamura Tokichi Uji", "Té y postres de Uji; opción clásica cerca del eje turístico.", "¥¥", "Nakamura Tokichi Uji"),
      suggestion("Itoh Kyuemon Uji", "Otra buena referencia para matcha, parfait y compras de té.", "¥¥", "Itoh Kyuemon Uji"),
    ],
    gallery: [
      photo("Byodoin_Phoenix_Hall_Uji_2009.jpg", "Byōdō-in · Uji"),
      photo("Fushimi_Inari-Taisha.jpg", "Fushimi Inari · Kyoto"),
    ],
  },
  "2026-12-11": {
    food: kyotoFood,
    shopping: kyotoShopping,
    dining: kyotoDining,
    gallery: [photo("Nishiki_Market_Kyoto.jpg", "Nishiki Market · Kyoto")],
    note: "Conferencia primero; comida/compras solo si la agenda deja tiempo.",
  },
  "2026-12-12": {
    food: kyotoFood,
    shopping: kyotoShopping,
    dining: kyotoDining,
    gallery: [photo("Otagi_Nenbutsu-ji_Kyoto.jpg", "Otagi Nenbutsu-ji · Kyoto")],
    note: "Conferencia primero; Otagi es opcional y depende del cierre de la jornada.",
  },
  "2026-12-13": {
    food: kyotoFood,
    shopping: kyotoShopping,
    dining: kyotoDining,
    gallery: [photo("Arashiyama_Bamboo_Forest_Kyoto_Japan.jpg", "Arashiyama · Kyoto")],
    note: "Conferencia primero; Arashiyama es un cierre flexible.",
  },
  "2026-12-14": {
    food: [
      suggestion("Okonomiyaki de Osaka", "Masa, col y toppings cocinados a la plancha; probar una versión clásica antes de variantes extravagantes.", "¥¥"),
      suggestion("Takoyaki", "Ideal como snack compartido en Dotonbori; cuidado: el interior suele estar muy caliente.", "¥"),
    ],
    shopping: [
      suggestion("Den Den Town", "Figuras, retro gaming y electrónica. Comparar varias tiendas antes de comprar productos usados.", "¥–¥¥¥"),
      suggestion("Omiyage de Osaka", "Takoyaki-flavored snacks o dulces locales si quieren algo consumible y ligero.", "¥"),
    ],
    dining: [
      suggestion("OKO - Fun Okonomiyaki Bar", "Okonomiyaki en Dotonbori, informal y con opciones vegetarianas/veganas.", "¥¥", "OKO Fun Okonomiyaki Bar Osaka"),
      suggestion("Kushikatsu en Shinsekai/Namba", "Si aún tienen hambre, compartir pinchos fritos en vez de otra comida completa.", "¥¥", "kushikatsu Namba Osaka"),
    ],
    gallery: [
      photo("Dotonbori_Ebisu_Bridge_Osaka.jpg", "Dotonbori · Osaka"),
      photo("Dotonbori_Glico_Sign.jpg", "Glico Sign · Dotonbori"),
    ],
  },
  "2026-12-15": {
    food: [
      suggestion("Comida temática de Super Nintendo World", "Elegir por experiencia visual, no por relación precio/cantidad; revisar tiempos de fila.", "¥¥¥"),
      suggestion("Gyukatsu al salir de USJ", "Alternativa contundente en CityWalk si no quieren gastar otra comida dentro del parque.", "¥¥"),
    ],
    shopping: [
      suggestion("Merch exclusivo de Super Nintendo World", "Priorizar Power-Up Band solo si van a usar la interacción del parque y recuerdos exclusivos.", "¥¥–¥¥¥"),
      suggestion("No cargar compras desde la mañana", "Dejar merch voluminoso para el final si es posible.", "—"),
    ],
    dining: [
      suggestion("Kinopio's Cafe", "La opción temática central dentro de Super Nintendo World; depende de acceso y cola.", "¥¥¥", "Kinopio's Cafe Universal Studios Japan"),
      suggestion("GYUKATSU Kyoto Katsugyu · Universal CityWalk", "Gyukatsu en CityWalk, práctico antes o después del parque.", "¥¥", "GYUKATSU Kyoto Katsugyu Universal Citywalk Osaka"),
    ],
    gallery: [
      photo("Universal_Studios_Japan_Super_Nintendo_World.jpg", "Super Nintendo World · USJ"),
      photo("Universal_Studios_Japan_entrance.jpg", "Universal Studios Japan"),
    ],
  },
  "2026-12-16": {
    food: [
      suggestion("Hiroshima-style okonomiyaki", "Capas de col, fideos, huevo y proteína; comparar con el estilo Osaka del día anterior.", "¥¥"),
      suggestion("Ostras de Hiroshima", "Producto emblemático local; pedir cocidas si prefieren una opción más conservadora.", "¥¥–¥¥¥"),
    ],
    shopping: [
      suggestion("Momiji manjū", "Pastelitos con forma de hoja; fáciles de llevar y hay múltiples rellenos.", "¥"),
      suggestion("Recuerdo del Peace Memorial Museum", "Si compran algo, preferir material editorial/memorial y mantener un tono respetuoso.", "¥"),
    ],
    dining: [
      suggestion("Okonomiyaki Ron · Okonomimura", "Counter pequeño de okonomiyaki estilo Hiroshima; buena comparación gastronómica.", "¥¥", "Okonomiyaki Ron Hiroshima"),
      suggestion("Kakifune Kanawa", "Ostras y cocina de Setouchi junto al Peace Park; opción más especial.", "¥¥¥–¥¥¥¥", "Oyster ship Kanawa Hiroshima"),
    ],
    gallery: [
      photo("Atomic_Bomb_Dome_in_Hiroshima.jpg", "A-Bomb Dome · Hiroshima"),
      photo("Hiroshima_Peace_Memorial_Museum.jpg", "Peace Memorial Museum · Hiroshima"),
    ],
  },
  "2026-12-17": {
    food: [
      suggestion("Kawara soba", "Fideos de té sobre placa caliente, especialidad de Yamaguchi; buena si encuentran una parada compatible.", "¥¥"),
      suggestion("Cena ligera en Hakata", "Guardar la gran cena de Fukuoka para el día siguiente; hoy hay bastante traslado.", "¥–¥¥"),
    ],
    shopping: [
      suggestion("Productos de karst/Akiyoshidai", "Solo souvenirs pequeños del centro de visitantes si realmente les interesan.", "¥"),
      suggestion("Hakata Station", "Dejar compras regionales para la estación al llegar; hay mucha más variedad.", "¥–¥¥"),
    ],
    dining: [
      suggestion("Hakata Issou Honten", "Tonkotsu intenso cerca de Hakata Station; útil si llegan con hambre y energía.", "¥", "Hakata Issou Honten"),
    ],
    gallery: [
      photo("Akiyoshido_Cave_Yamaguchi.jpg", "Akiyoshidō Cave"),
      photo("Akiyoshidai_Yamaguchi.jpg", "Akiyoshidai · Yamaguchi"),
    ],
  },
  "2026-12-18": {
    food: [
      suggestion("Hakata tonkotsu ramen", "Caldo de cerdo, fideo fino y kaedama; pedir firmeza normal la primera vez.", "¥"),
      suggestion("Motsunabe / yatai", "Motsunabe para sentarse; yatai para la experiencia callejera nocturna.", "¥¥–¥¥¥"),
    ],
    shopping: [
      suggestion("Mentaiko", "Huevas picantes; si no pueden refrigerar, comprar versión seca/procesada para viaje.", "¥¥"),
      suggestion("Gundam merch en LaLaport", "Mirar exclusivas RX-93ff ν Gundam antes de comprar productos genéricos.", "¥–¥¥¥"),
    ],
    dining: [
      suggestion("Hakata Issou Honten", "Ramen Hakata de caldo muy marcado; cerca de la estación.", "¥", "Hakata Issou Honten"),
      suggestion("Nakasu Yatai", "Puestos nocturnos junto al río; ir por la experiencia, comparar precios antes de sentarse.", "¥¥", "Nakasu Food Stalls Street Fukuoka"),
    ],
    gallery: [
      photo("Nanzoin_Reclining_Buddha.jpg", "Nanzoin · Buda reclinado"),
      photo("RX-93ff_Nu_Gundam_Lalaport_Fukuoka.jpg", "ν Gundam · LaLaport Fukuoka"),
    ],
  },
  "2026-12-19": {
    food: [
      suggestion("Imari beef", "Si aparece una opción razonable en Imari, compartir un plato en vez de convertirlo en comida larga.", "¥¥¥"),
      suggestion("Champon al llegar a Nagasaki", "Fideos con verduras, mariscos/carne y caldo; plato muy representativo para la noche.", "¥¥"),
    ],
    shopping: [
      suggestion("Cerámica Nabeshima / Imari", "Este es el día ideal para una pieza pequeña y bien elegida. Protegerla bien para el resto del viaje.", "¥¥–¥¥¥"),
      suggestion("Castella", "Bizcocho asociado a Nagasaki; comprar una pieza pequeña al llegar o al día siguiente.", "¥"),
    ],
    dining: [
      suggestion("Champon 358", "Champon en el centro de Nagasaki; opción centrada en verduras y relativamente ligera.", "¥", "champon358 Nagasaki"),
    ],
    gallery: [
      photo("Okawachiyama_Imari_Saga.jpg", "Okawachiyama · Saga"),
      photo("Okawachiyama_kilns.jpg", "Hornos y cerámica de Okawachiyama"),
    ],
  },
  "2026-12-20": {
    food: [
      suggestion("Champon / sara udon", "Si no probaron champon la noche anterior, hacerlo hoy; sara udon es la alternativa crujiente.", "¥¥"),
      suggestion("Castella", "Buen snack para el traslado a Kumamoto.", "¥"),
    ],
    shopping: [
      suggestion("Castella de Nagasaki", "Caja pequeña y sellada para transportar.", "¥"),
      suggestion("Kumamon", "Esperar a Kumamoto para merch oficial de Kumamon; hay más variedad.", "¥–¥¥"),
    ],
    dining: [
      suggestion("Champon 358", "Opción central para champon antes del traslado.", "¥", "champon358 Nagasaki"),
      suggestion("Mutsugorō", "Cena opcional en Kumamoto si llegan con energía: especialidades locales y carne de caballo.", "¥¥¥", "Mutsugoro Kumamoto"),
    ],
    gallery: [
      photo("Nagasaki_Peace_Park_statue.jpg", "Peace Park · Nagasaki"),
      photo("Nagasaki_Atomic_Bomb_Museum.jpg", "Atomic Bomb Museum · Nagasaki"),
    ],
  },
  "2026-12-21": {
    food: [
      suggestion("Basashi", "Carne de caballo cruda, especialidad de Kumamoto. Solo si les interesa; hay alternativas cocidas.", "¥¥¥"),
      suggestion("Karashi renkon", "Raíz de loto rellena de mostaza; probar una porción pequeña por el picante.", "¥"),
    ],
    shopping: [
      suggestion("Kumamon", "Merch oficial y snacks; elegir algo pequeño porque todavía queda bastante viaje.", "¥–¥¥"),
      suggestion("One Piece statue merch", "Solo si encuentran producto oficial/local vinculado a la ruta de estatuas.", "¥–¥¥"),
    ],
    dining: [
      suggestion("Mutsugorō", "Izakaya de cocina regional y múltiples preparaciones de carne de caballo.", "¥¥¥", "Mutsugoro Kumamoto"),
      suggestion("Aoyagi", "Cocina Higo regional más amplia si prefieren probar varias especialidades y no centrarse en basashi.", "¥¥¥", "Aoyagi Kumamoto"),
    ],
    gallery: [
      photo("Kumamoto_Castle_2019.jpg", "Kumamoto Castle"),
      photo("Luffy_statue_Kumamoto.jpg", "Luffy Statue · Kumamoto"),
    ],
  },
  "2026-12-22": {
    food: [
      suggestion("Akaushi-don", "Arroz con carne roja de Aso; es la especialidad más clara para este día.", "¥¥–¥¥¥"),
      suggestion("Leche/helado de Aso", "Pausa corta si encuentran producto local cerca de Kusasenri.", "¥"),
    ],
    shopping: [
      suggestion("Productos lácteos de Aso", "Solo productos que toleren el tiempo de traslado; mejor consumirlos el mismo día.", "¥"),
      suggestion("Usopp / One Piece", "Foto primero; merch solo si es oficial y realmente distinto a lo visto en Kumamoto.", "¥–¥¥"),
    ],
    dining: [
      suggestion("Imakin Shokudo", "Destino conocido por akaushi-don en Uchinomaki; puede tener espera, así que no sacrificar Kusasenri por una fila excesiva.", "¥¥", "Imakin Shokudo Aso"),
    ],
    gallery: [
      photo("Kusasenri_Aso_Kumamoto.jpg", "Kusasenri · Aso"),
      photo("Mount_Aso_Nakadake.jpg", "Monte Aso · Nakadake"),
    ],
  },
  "2026-12-23": {
    food: [
      suggestion("Takachiho beef", "Carne local; un donburi o set es suficiente para probarla sin alargar demasiado el día.", "¥¥–¥¥¥"),
      suggestion("Chicken nanban", "Especialidad de Miyazaki; puede probarse aquí si no quieren dejarla para Miyazaki ciudad.", "¥¥"),
    ],
    shopping: [
      suggestion("Productos de Takachiho", "Miel, dulces o recuerdos del mito local; escoger algo pequeño.", "¥"),
      suggestion("Amuletos de Takachiho Shrine", "Solo si les interesa el significado; no tratarlos como souvenir genérico.", "¥"),
    ],
    dining: [
      suggestion("Tomoemaru", "Shokudo cerca de Takachiho Shrine con opciones de Takachiho beef y chicken nanban.", "¥¥", "Tomoemaru Takachiho"),
    ],
    gallery: [
      photo("Takachiho-gorge.jpg", "Takachiho Gorge"),
      photo("Takachiho_Gorge_(52133238863).jpg", "Manai Falls · Takachiho"),
    ],
  },
  "2026-12-24": {
    food: [
      suggestion("Chicken nanban", "La comida de Miyazaki que más vale la pena priorizar si el horario del vuelo lo permite.", "¥¥"),
      suggestion("Mango / dulces de mango", "Fuera de temporada fresco puede ser caro; los dulces empaquetados funcionan mejor como recuerdo.", "¥–¥¥"),
    ],
    shopping: [
      suggestion("Dulces de mango Miyazaki", "Más prácticos que fruta fresca para seguir viajando.", "¥"),
      suggestion("Nada voluminoso antes del vuelo", "Ya cambian de isla y comienzan Tokyo; mantener equipaje controlado.", "—"),
    ],
    dining: [
      suggestion("Ogura Honten", "Referencia clásica de Miyazaki para chicken nanban; usar solo si el vuelo deja margen suficiente.", "¥¥", "Ogura Honten Miyazaki"),
    ],
    gallery: [
      photo("Aoshima_Shrine_Miyazaki.jpg", "Aoshima Shrine · Miyazaki"),
      photo("Tokyo_Haneda_Airport_Terminal_3.jpg", "Llegada a Tokyo · Haneda"),
    ],
  },
  "2026-12-25": {
    food: tokyoFood,
    shopping: [
      suggestion("Nintendo Tokyo / Pokémon Center Shibuya", "Comparar exclusivas de tienda; evitar comprar aquí lo mismo que ya vieron en Nintendo Museum.", "¥–¥¥¥"),
      suggestion("PARCO / Jump Shop", "Merch oficial de anime; fijar presupuesto antes de entrar.", "¥–¥¥¥"),
    ],
    dining: [
      suggestion("ICHIRAN Shibuya", "Ramen tonkotsu abierto 24 h; útil como opción flexible si el día se alarga.", "¥", "ICHIRAN Shibuya"),
      suggestion("Depachika / Shibuya food hall", "Buena alternativa si quieren probar varias cosas en vez de una cena larga.", "¥–¥¥", "Shibuya food hall Tokyo"),
    ],
    gallery: [
      photo("Shibuya_crossing,_Tokyo,_Japan.jpg", "Shibuya Crossing"),
      photo("Shibuya_Parco_Tokyo.jpg", "Shibuya PARCO"),
    ],
  },
  "2026-12-26": {
    food: [
      suggestion("Café / comida en Kichijoji", "Comer antes o después del museo; no contar con poder improvisar dentro del Ghibli Museum.", "¥¥"),
      ...tokyoFood.slice(1),
    ],
    shopping: [
      suggestion("Ghibli Museum shop", "Priorizar piezas específicas del museo; son más memorables que merch Ghibli genérico.", "¥–¥¥¥"),
      suggestion("Nakano Broadway", "Mandarake, figuras y coleccionables; revisar estado/precio si compran segunda mano.", "¥–¥¥¥"),
    ],
    dining: [
      suggestion("Cultiver", "Opción especial en Mitaka si quieren convertir la zona Ghibli en una comida más pausada; reservar.", "¥¥¥¥", "Cultiver Mitaka"),
      suggestion("Kichijoji Harmonica Yokocho", "Alternativa casual con muchos locales pequeños.", "¥¥", "Harmonica Yokocho Kichijoji"),
    ],
    gallery: [
      photo("Ghibli_Museum,_Mitaka.jpg", "Ghibli Museum · Mitaka"),
      photo("Nakano_Broadway_2018.jpg", "Nakano Broadway"),
    ],
  },
  "2026-12-27": {
    food: [
      suggestion("Comida temática Disney", "Elegir una experiencia temática que les interese y el resto del día comer rápido para no perder horas.", "¥¥–¥¥¥"),
      suggestion("Popcorn de sabores", "Probar un bucket solo si lo quieren como recuerdo; los sabores cambian por zona.", "¥"),
    ],
    shopping: [
      suggestion("Merch exclusivo Tokyo Disney Resort", "Priorizar productos que indiquen Tokyo Disney Resort, no Disney genérico.", "¥–¥¥¥"),
      suggestion("Duffy & Friends", "Solo si les gusta la línea; es una de las diferencias fuertes frente a parques occidentales.", "¥–¥¥¥"),
    ],
    dining: [
      suggestion("Queen of Hearts Banquet Hall", "Restaurante temático dentro de Disneyland; verificar operación/cola en app.", "¥¥¥", "Queen of Hearts Banquet Hall Tokyo Disneyland"),
      suggestion("Ikspiari", "Plan B al salir del parque para cenar con más variedad.", "¥¥", "Ikspiari restaurants Maihama"),
    ],
    gallery: [
      photo("Tokyo_Disneyland_Cinderella_Castle.jpg", "Cinderella Castle · Tokyo Disneyland"),
      photo("Tokyo_Disneyland_entrance.jpg", "Tokyo Disneyland"),
    ],
  },
  "2026-12-28": {
    food: [
      suggestion("Hōtō", "Fideos anchos cocidos con verduras en caldo de miso; comida perfecta para frío junto a Fuji.", "¥¥"),
      suggestion("Dulces de uva/melocotón Yamanashi", "Versión empaquetada si quieren recuerdo; diciembre no es temporada de fruta fresca.", "¥"),
    ],
    shopping: [
      suggestion("Fuji / Yamanashi omiyage", "Imanes y souvenirs solo si la foto/visibilidad del día lo vuelve significativo.", "¥"),
      suggestion("Productos de fruta Yamanashi", "Galletas, jaleas o dulces viajan mejor que producto fresco.", "¥"),
    ],
    dining: [
      suggestion("Houtou Fudou · Kawaguchiko North", "Especialista en hōtō cerca del lago; encaja bien con un día frío de Fuji.", "¥¥", "Houtou Fudou Kawaguchiko North Main Shop"),
    ],
    gallery: [
      photo("Mount_Fuji_from_Lake_Kawaguchi.jpg", "Monte Fuji desde Lake Kawaguchi"),
      photo("Lake_Kawaguchi_and_Mount_Fuji.jpg", "Lake Kawaguchi · Fuji"),
    ],
  },
  "2026-12-29": {
    food: tokyoFood,
    shopping: [
      suggestion("Nakamise", "Snacks y recuerdos en Asakusa; comprar temprano antes de que se llene.", "¥–¥¥"),
      suggestion("Akihabara", "Retro gaming, electrónica y anime; comparar precios entre tiendas y revisar tax-free.", "¥–¥¥¥"),
    ],
    dining: [
      suggestion("SUSHI EDOMARU Asakusa", "Sushi accesible cerca de los principales puntos de Asakusa.", "¥¥", "SUSHI EDOMARU Asakusa"),
      suggestion("Roast Beef Ōno Akihabara", "Donburi de roast beef; buena cena rápida entre tiendas.", "¥¥", "Roast Beef Ono Akihabara"),
    ],
    gallery: [
      photo("Sensoji_Temple_Tokyo.jpg", "Sensō-ji · Asakusa"),
      photo("Akihabara_Night.jpg", "Akihabara · Tokyo"),
    ],
  },
  "2026-12-30": {
    food: tokyoFood,
    shopping: tokyoShopping,
    dining: [
      suggestion("Azabudai Hills dining", "Comer cerca de teamLab para evitar cruzar Tokyo otra vez al final del día.", "¥¥–¥¥¥", "Azabudai Hills restaurants"),
      suggestion("Shinjuku izakaya", "Si terminan temprano, cena casual por Shinjuku; elegir local con precios visibles.", "¥¥", "Shinjuku izakaya Tokyo"),
    ],
    gallery: [
      photo("Suga_Shrine_stairs_Tokyo.jpg", "Suga Shrine stairs · Your Name"),
      photo("teamLab_Borderless_Azabudai_Hills.jpg", "teamLab Borderless · Azabudai Hills"),
    ],
  },
  "2026-12-31": {
    food: [
      suggestion("Toshikoshi soba", "Soba de fin de año; es la comida temática más pertinente para el 31.", "¥–¥¥"),
      suggestion("Depachika", "Comprar comida preparada antes de cierres tempranos; muchos negocios reducen horario.", "¥–¥¥"),
    ],
    shopping: [
      suggestion("Tokyo Station Character Street", "Última oportunidad compacta para merch sin desviarse demasiado.", "¥–¥¥¥"),
      suggestion("Omiyage de estación", "Comprar regalos consumibles para Colombia si ya conocen el peso disponible.", "¥–¥¥"),
    ],
    dining: [
      suggestion("Tokyo Station / Marunouchi", "Zona útil para cenar temprano; verificar horarios especiales de Ōmisoka.", "¥¥", "Tokyo Station restaurants"),
    ],
    gallery: [
      photo("Tokyo_Station_Marunouchi_Building.jpg", "Tokyo Station · Marunouchi"),
      photo("Odaiba_Tokyo_at_night.jpg", "Odaiba · Tokyo"),
    ],
    note: "31 de diciembre: confirmar horarios el mismo día. No asumir operación normal.",
  },
  "2027-01-01": {
    food: [
      suggestion("Ozōni", "Sopa de Año Nuevo si aparece disponible; la preparación varía por región.", "¥¥"),
      suggestion("Ekiben", "Muy práctico para el Shinkansen en un día con horarios festivos.", "¥–¥¥"),
    ],
    shopping: [
      suggestion("Omamori de hatsumōde", "Solo si quieren un amuleto con significado; respetar las normas del santuario.", "¥"),
      suggestion("Fukubukuro", "Bolsas sorpresa de Año Nuevo: comprar solo de una tienda/marca que realmente les guste.", "¥¥–¥¥¥"),
    ],
    dining: [
      suggestion("Comida en Fukushima/Yamagata Station", "El 1 de enero la disponibilidad puede ser limitada; usar estación como opción operacional.", "¥¥", "Yamagata Station restaurants"),
    ],
    gallery: [
      photo("Fukushima_Inari_Shrine.jpg", "Fukushima Inari Shrine"),
      photo("Yamagata_Station_winter.jpg", "Yamagata · invierno"),
    ],
    note: "Año Nuevo: las sugerencias son especialmente dependientes de horarios festivos.",
  },
  "2027-01-02": {
    food: [
      suggestion("Yamagata soba", "Ita-soba o soba artesanal antes/después del traslado a Ginzan.", "¥¥"),
      suggestion("Onsen manju", "Dulce clásico de pueblos termales; comprar pocos para comer frescos.", "¥"),
    ],
    shopping: [
      suggestion("Ginzan Onsen omiyage", "Productos pequeños del pueblo termal; evitar vidrio si todavía faltan vuelos.", "¥"),
      suggestion("Sake de Yamagata", "Solo si tienen equipaje facturado y quieren cargar botella el resto del viaje.", "¥¥"),
    ],
    dining: [
      suggestion("Shojiya", "Soba tradicional en Yamagata; mejor para comida antes de subir hacia Ginzan si la logística encaja.", "¥¥", "Shojiya Yamagata"),
      suggestion("Restaurante/ryokan de Ginzan", "En invierno conviene comer donde permita la reserva o alojamiento; hay menos opciones espontáneas.", "¥¥–¥¥¥", "Ginzan Onsen restaurants"),
    ],
    gallery: [
      photo("Ginzan_Onsen_Yamagata_winter.jpg", "Ginzan Onsen · invierno"),
      photo("Ginzan_Onsen_at_night.jpg", "Ginzan Onsen · noche"),
    ],
  },
  "2027-01-03": {
    food: [
      suggestion("Apple pie de Hirosaki", "Hirosaki es ciudad de manzana; hacer una degustación de 1–2 versiones, no cinco.", "¥"),
      suggestion("Tsugaru local cuisine", "Scallops, squid y preparaciones regionales para la cena.", "¥¥–¥¥¥"),
    ],
    shopping: [
      suggestion("Productos de manzana Aomori", "Jugo, caramelos o pie empaquetado: buen recuerdo local.", "¥–¥¥"),
      suggestion("Tsugaru lacquerware", "Bonito pero más delicado/caro; mirar piezas pequeñas si interesa artesanía.", "¥¥–¥¥¥"),
    ],
    dining: [
      suggestion("Taishō Roman Tea Room", "Café histórico con postres de manzana; encaja bien antes de la iluminación.", "¥¥", "Taisho Roman Tea Room Hirosaki"),
      suggestion("Kikufuji Main Store", "Cocina regional Tsugaru/Hirosaki y sake local.", "¥¥–¥¥¥", "Kikufuji Hirosaki"),
    ],
    gallery: [
      photo("Hirosaki_Castle_winter.jpg", "Hirosaki Castle · invierno"),
      photo("Hirosaki_Park_winter_illumination.jpg", "Hirosaki Park · iluminación invernal"),
    ],
  },
  "2027-01-04": {
    food: [
      suggestion("Soup curry", "Caldo especiado con verduras/carne; excelente opción para el frío de Sapporo.", "¥¥"),
      suggestion("Miso ramen", "Sapporo es uno de los lugares naturales para probarlo.", "¥¥"),
    ],
    shopping: [
      suggestion("Shiroi Koibito", "Omiyage clásico de Hokkaidō y fácil de transportar.", "¥"),
      suggestion("Productos de leche Hokkaidō", "Chocolate/caramelos viajan mejor que lácteos frescos.", "¥"),
    ],
    dining: [
      suggestion("GARAKU Soup Curry", "Soup curry popular en Sapporo; revisar cola antes de comprometer la noche.", "¥¥", "GARAKU Soup Curry Sapporo"),
      suggestion("Ramen Shingen", "Opción conocida para miso ramen en Sapporo.", "¥¥", "Ramen Shingen Sapporo"),
    ],
    gallery: [
      photo("Sapporo_Odori_Park_winter.jpg", "Odori Park · Sapporo"),
      photo("Sapporo_TV_Tower_at_night.jpg", "Sapporo nocturno"),
    ],
  },
  "2027-01-05": {
    food: [
      suggestion("Seafood bowl / sushi", "Última comida de Hokkaidō si el horario de salida lo permite.", "¥¥–¥¥¥"),
      suggestion("Soft cream de Hokkaidō", "Postre rápido en CTS si no quieren añadir una parada logística.", "¥"),
    ],
    shopping: [
      suggestion("New Chitose Airport", "Gran lugar para cerrar omiyage de Hokkaidō sin cargarlo durante días.", "¥–¥¥"),
      suggestion("Royce / Shiroi Koibito", "Comprar al final para minimizar riesgo de calor/golpes.", "¥–¥¥"),
    ],
    dining: [
      suggestion("New Chitose Airport food court / ramen", "Plan robusto si Lake Shikotsu queda apretado; muchas opciones antes del vuelo.", "¥–¥¥", "New Chitose Airport restaurants"),
    ],
    gallery: [
      photo("Lake_Shikotsu_Hokkaido.jpg", "Lake Shikotsu · Hokkaidō"),
      photo("New_Chitose_Airport.jpg", "New Chitose Airport"),
    ],
    note: "El vuelo manda: Lake Shikotsu y la comida deben adaptarse al horario real de salida.",
  },
};
