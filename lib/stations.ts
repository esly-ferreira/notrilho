/**
 * Estação da CPTM com coordenadas para cálculo de distância.
 */
export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

/**
 * Lista fixa de estações da Linha 7 Rubi (CPTM) na ordem da linha.
 * Coordenadas aproximadas para cálculo de Haversine.
 */
export const LINE_7_STATIONS: Station[] = [
  { id: "jundiai", name: "Jundiaí", latitude: -23.195278, longitude: -46.872361 },
  { id: "varzea-paulista", name: "Várzea Paulista", latitude: -23.209, longitude: -46.829167 },
  { id: "campo-limpo-paulista", name: "Campo Limpo Paulista", latitude: -23.206833, longitude: -46.785278 },
  { id: "botujuru", name: "Botujuru", latitude: -23.236222, longitude: -46.7675 },
  { id: "francisco-morato", name: "Francisco Morato", latitude: -23.281667, longitude: -46.7425 },
  { id: "baltazar-fidelis", name: "Baltazar Fidélis", latitude: -23.309889, longitude: -46.72375 },
  { id: "franco-da-rocha", name: "Franco da Rocha", latitude: -23.329722, longitude: -46.726389 },
  { id: "caieiras", name: "Caieiras", latitude: -23.366111, longitude: -46.751667 },
  { id: "perus", name: "Perus", latitude: -23.404722, longitude: -46.75375 },
  { id: "vila-aurora", name: "Vila Aurora", latitude: -23.4375, longitude: -46.747361 },
  { id: "jaragua", name: "Jaraguá", latitude: -23.455278, longitude: -46.738611 },
  { id: "vila-clarice", name: "Vila Clarice", latitude: -23.47, longitude: -46.744444 },
  { id: "pirituba", name: "Pirituba", latitude: -23.488611, longitude: -46.726111 },
  { id: "piqueri", name: "Piqueri", latitude: -23.503889, longitude: -46.714722 },
  { id: "lapa", name: "Lapa", latitude: -23.517611, longitude: -46.704167 },
  { id: "agua-branca", name: "Água Branca", latitude: -23.521111, longitude: -46.688333 },
  { id: "barra-funda", name: "Barra Funda", latitude: -23.525556, longitude: -46.667444 },
];

/**
 * Lista fixa de estações da Linha 8 Diamante (CPTM) na ordem da linha.
 * Amador Bueno → Júlio Prestes. Coordenadas aproximadas para cálculo de Haversine.
 */
export const LINE_8_STATIONS: Station[] = [
  { id: "amador-bueno", name: "Amador Bueno", latitude: -23.421, longitude: -47.036 },
  { id: "ambuita", name: "Ambuítá", latitude: -23.43, longitude: -47.02 },
  { id: "santa-rita", name: "Santa Rita", latitude: -23.439, longitude: -47.004 },
  { id: "itapevi", name: "Itapevi", latitude: -23.448, longitude: -46.988 },
  { id: "engenheiro-cardoso", name: "Engenheiro Cardoso", latitude: -23.457, longitude: -46.972 },
  { id: "sagrado-coracao", name: "Sagrado Coração", latitude: -23.466, longitude: -46.956 },
  { id: "jardim-silveira", name: "Jardim Silveira", latitude: -23.475, longitude: -46.940 },
  { id: "jandira", name: "Jandira", latitude: -23.484, longitude: -46.924 },
  { id: "jardim-belval", name: "Jardim Belval", latitude: -23.493, longitude: -46.908 },
  { id: "antonio-joao", name: "Antonio João", latitude: -23.502, longitude: -46.892 },
  { id: "barueri", name: "Barueri", latitude: -23.511, longitude: -46.876 },
  { id: "santa-terezinha", name: "Santa Terezinha", latitude: -23.528, longitude: -46.852 },
  { id: "carapicuiba", name: "Carapicuíba", latitude: -23.522, longitude: -46.836 },
  { id: "general-miguel-costa", name: "General Miguel Costa", latitude: -23.518, longitude: -46.842 },
  { id: "quitauna", name: "Quitaúna", latitude: -23.524, longitude: -46.825 },
  { id: "comandante-sampaio", name: "Comandante Sampaio", latitude: -23.528, longitude: -46.808 },
  { id: "osasco", name: "Osasco", latitude: -23.532, longitude: -46.791 },
  { id: "presidente-altino", name: "Presidente Altino", latitude: -23.538, longitude: -46.758 },
  { id: "imperatriz-leopoldina", name: "Imperatriz Leopoldina", latitude: -23.532, longitude: -46.742 },
  { id: "domingos-de-moraes", name: "Domingos de Moraes", latitude: -23.527, longitude: -46.724 },
  { id: "lapa-8", name: "Lapa", latitude: -23.521, longitude: -46.704 },
  { id: "barra-funda", name: "Barra Funda", latitude: -23.525556, longitude: -46.667444 },
  { id: "julio-prestes", name: "Júlio Prestes", latitude: -23.533, longitude: -46.639 },
];

/**
 * Lista fixa de estações da Linha 9 Esmeralda (CPTM) na ordem da linha.
 * Osasco → Varginha. Coordenadas aproximadas para cálculo de Haversine.
 */
export const LINE_9_STATIONS: Station[] = [
  { id: "osasco-9", name: "Osasco", latitude: -23.532, longitude: -46.791 },
  { id: "presidente-altino-9", name: "Presidente Altino", latitude: -23.538, longitude: -46.758 },
  { id: "ceasa", name: "Ceasa", latitude: -23.541, longitude: -46.748 },
  { id: "vila-lobos-jaguare", name: "Vila Lobos-Jaguaré", latitude: -23.545, longitude: -46.738 },
  { id: "cidade-universitaria", name: "Cidade Universitária", latitude: -23.551, longitude: -46.718 },
  { id: "pinheiros-9", name: "Pinheiros", latitude: -23.565, longitude: -46.698 },
  { id: "hebraica-reboucas", name: "Hebraica-Rebouças", latitude: -23.572, longitude: -46.692 },
  { id: "cidade-jardim", name: "Cidade Jardim", latitude: -23.578, longitude: -46.688 },
  { id: "vila-olimpia", name: "Vila Olímpia", latitude: -23.586, longitude: -46.682 },
  { id: "berrini", name: "Berrini", latitude: -23.593, longitude: -46.688 },
  { id: "morumbi", name: "Morumbi", latitude: -23.598, longitude: -46.702 },
  { id: "granja-julieta", name: "Granja Julieta", latitude: -23.612, longitude: -46.708 },
  { id: "joao-dias", name: "João Dias", latitude: -23.618, longitude: -46.715 },
  { id: "santo-amaro", name: "Santo Amaro", latitude: -23.648, longitude: -46.722 },
  { id: "socorro-9", name: "Socorro", latitude: -23.662, longitude: -46.718 },
  { id: "jurubatuba", name: "Jurubatuba", latitude: -23.678, longitude: -46.712 },
  { id: "autodromo", name: "Autódromo", latitude: -23.698, longitude: -46.698 },
  { id: "primavera-interlagos", name: "Primavera-Interlagos", latitude: -23.712, longitude: -46.685 },
  { id: "grajau", name: "Grajaú", latitude: -23.728, longitude: -46.668 },
  { id: "mendes-vila-natal", name: "Mendes-Vila Natal", latitude: -23.738, longitude: -46.652 },
  { id: "bruno-covas", name: "Bruno Covas", latitude: -23.748, longitude: -46.638 },
  { id: "varginha", name: "Varginha", latitude: -23.758, longitude: -46.625 },
];

/**
 * Lista fixa de estações da Linha 10 Turquesa (CPTM) na ordem da linha.
 * Luz → Rio Grande da Serra. Coordenadas aproximadas para cálculo de Haversine.
 */
export const LINE_10_STATIONS: Station[] = [
  { id: "luz-10", name: "Luz", latitude: -23.535, longitude: -46.636 },
  { id: "bras-10", name: "Brás", latitude: -23.548, longitude: -46.616 },
  { id: "mooca", name: "Mooca", latitude: -23.552, longitude: -46.598 },
  { id: "ipiranga", name: "Ipiranga", latitude: -23.585, longitude: -46.608 },
  { id: "tamanduatei", name: "Tamanduatei", latitude: -23.598, longitude: -46.632 },
  { id: "sao-caetano", name: "São Caetano", latitude: -23.618, longitude: -46.585 },
  { id: "utinga", name: "Utinga", latitude: -23.652, longitude: -46.542 },
  { id: "prefeito-saladino", name: "Prefeito Saladino", latitude: -23.668, longitude: -46.528 },
  { id: "santo-andre", name: "Santo André", latitude: -23.672, longitude: -46.532 },
  { id: "capuava", name: "Capuava", latitude: -23.692, longitude: -46.558 },
  { id: "maua", name: "Mauá", latitude: -23.668, longitude: -46.462 },
  { id: "guapituba", name: "Guapituba", latitude: -23.682, longitude: -46.442 },
  { id: "ribeirao-pires", name: "Ribeirão Pires", latitude: -23.708, longitude: -46.412 },
  { id: "rio-grande-da-serra", name: "Rio Grande da Serra", latitude: -23.742, longitude: -46.398 },
];

/**
 * Lista fixa de estações da Linha 11 Coral (CPTM) na ordem da linha.
 * Palmeiras-Barra Funda → Estudantes. Coordenadas aproximadas para cálculo de Haversine.
 */
export const LINE_11_STATIONS: Station[] = [
  { id: "palmeiras-barra-funda", name: "Palmeiras-Barra Funda", latitude: -23.526, longitude: -46.665 },
  { id: "luz-11", name: "Luz", latitude: -23.535, longitude: -46.636 },
  { id: "bras-11", name: "Brás", latitude: -23.548, longitude: -46.616 },
  { id: "tatuape", name: "Tatuapé", latitude: -23.528, longitude: -46.576 },
  { id: "corinthians-itaquera", name: "Corinthians - Itaquera", latitude: -23.542, longitude: -46.472 },
  { id: "dom-bosco", name: "Dom Bosco", latitude: -23.548, longitude: -46.448 },
  { id: "jose-bonifacio", name: "José Bonifácio", latitude: -23.558, longitude: -46.418 },
  { id: "guaianases", name: "Guaianases", latitude: -23.542, longitude: -46.398 },
  { id: "antonio-gianetti-neto", name: "Antonio Gianetti Neto", latitude: -23.538, longitude: -46.368 },
  { id: "ferraz-de-vasconcelos", name: "Ferraz de Vasconcelos", latitude: -23.542, longitude: -46.368 },
  { id: "calmon-viana", name: "Calmon Viana", latitude: -23.528, longitude: -46.318 },
  { id: "suzano", name: "Suzano", latitude: -23.542, longitude: -46.312 },
  { id: "jundiapeba", name: "Jundiapeba", latitude: -23.558, longitude: -46.282 },
  { id: "braz-cubas", name: "Braz Cubas", latitude: -23.522, longitude: -46.188 },
  { id: "mogi-das-cruzes", name: "Mogi das Cruzes", latitude: -23.525, longitude: -46.182 },
  { id: "estudantes", name: "Estudantes", latitude: -23.518, longitude: -46.172 },
];

/**
 * Lista fixa de estações da Linha 12 Safira (CPTM) na ordem da linha.
 * Brás → Calmon Viana. Coordenadas aproximadas para cálculo de Haversine.
 */
export const LINE_12_STATIONS: Station[] = [
  { id: "bras-12", name: "Brás", latitude: -23.548, longitude: -46.616 },
  { id: "tatuape-12", name: "Tatuapé", latitude: -23.528, longitude: -46.576 },
  { id: "engenheiro-goulart", name: "Engenheiro Goulart", latitude: -23.532, longitude: -46.548 },
  { id: "usp-leste", name: "USP Leste", latitude: -23.538, longitude: -46.518 },
  { id: "comendador-ermelino", name: "Comendador Ermelino", latitude: -23.542, longitude: -46.488 },
  { id: "sao-miguel-paulista", name: "São Miguel Paulista", latitude: -23.498, longitude: -46.448 },
  { id: "jardim-helena-vila-mara", name: "Jardim Helena-Vila Mara", latitude: -23.502, longitude: -46.418 },
  { id: "itaim-paulista", name: "Itaim Paulista", latitude: -23.508, longitude: -46.388 },
  { id: "jardim-romano", name: "Jardim Romano", latitude: -23.518, longitude: -46.358 },
  { id: "engenheiro-manoel-feio", name: "Engenheiro Manoel Feio", latitude: -23.522, longitude: -46.338 },
  { id: "itaquaquecetuba", name: "Itaquaquecetuba", latitude: -23.485, longitude: -46.348 },
  { id: "aracare", name: "Aracaré", latitude: -23.492, longitude: -46.332 },
  { id: "calmon-viana-12", name: "Calmon Viana", latitude: -23.528, longitude: -46.318 },
];

/**
 * Lista fixa de estações da Linha 13 Jade (CPTM) na ordem da linha.
 * Engenheiro Goulart → Aeroporto - Guarulhos. Coordenadas aproximadas para cálculo de Haversine.
 */
export const LINE_13_STATIONS: Station[] = [
  { id: "engenheiro-goulart-13", name: "Engenheiro Goulart", latitude: -23.532, longitude: -46.548 },
  { id: "guarulhos-cecap", name: "Guarulhos - CECAP", latitude: -23.458, longitude: -46.518 },
  { id: "aeroporto-guarulhos", name: "Aeroporto - Guarulhos", latitude: -23.435, longitude: -46.473 },
];