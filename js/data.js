/**
 * Datos de proyectos inmobiliarios en Lima
 * Coordenadas aproximadas para distritos de Lima
 */
const sampleProjects = [
    {
        id: 1,
        name: "Torre Bicentenario",
        district: "sanisidro",
        type: "comercial",
        status: "finalizado",
        lat: -12.0964,
        lng: -77.0323,
        x: -77.0323,
        y: -12.0964,
        description: "Edificio de oficinas de clase A con 25 pisos ubicado en el corazón financiero de San Isidro. Cuenta con certificación LEED Gold y ofrece espacios de trabajo modernos y eficientes."
    },
    {
        id: 2,
        name: "Residencial Parque del Mar",
        district: "miraflores",
        type: "residencial",
        status: "finalizado",
        lat: -12.1214,
        lng: -77.0412,
        x: -77.0412,
        y: -12.1214,
        description: "Exclusivo condominio residencial frente al malecón con vista al mar. Ofrece departamentos de 2 y 3 dormitorios con acabados de lujo, áreas comunes, piscina y gimnasio."
    },
    {
        id: 3,
        name: "Centro Comercial Lima Sur",
        district: "surco",
        type: "comercial",
        status: "construccion",
        lat: -12.1491,
        lng: -76.9916,
        x: -76.9916,
        y: -12.1491,
        description: "Nuevo centro comercial con más de 150 tiendas, food court, cines y estacionamiento para 1,500 vehículos. Apertura estimada para el segundo trimestre del próximo año."
    },
    {
        id: 4,
        name: "Condominio Los Álamos",
        district: "surco",
        type: "residencial",
        status: "finalizado",
        lat: -12.1394,
        lng: -77.0057,
        x: -77.0057,
        y: -12.1394,
        description: "Condominio cerrado con vigilancia 24/7, áreas verdes y juegos para niños. Departamentos de 60m² a 120m² con excelente iluminación natural."
    },
    {
        id: 5,
        name: "Torres Lince View",
        district: "lince",
        type: "residencial",
        status: "construccion",
        lat: -12.0825,
        lng: -77.0359,
        x: -77.0359,
        y: -12.0825,
        description: "Complejo de 3 torres residenciales con departamentos desde 40m² hasta 90m². Ubicado cerca al Parque Mariscal Castilla y con fácil acceso al transporte público."
    },
    {
        id: 6,
        name: "Barranco Arte Hub",
        district: "barranco",
        type: "mixto",
        status: "planos",
        lat: -12.1490,
        lng: -77.0223,
        x: -77.0223,
        y: -12.1490,
        description: "Proyecto de uso mixto que combina departamentos tipo loft, espacios de coworking y galerías de arte. Inspirado en el carácter bohemio y cultural de Barranco."
    },
    {
        id: 7,
        name: "Edificio Green Office",
        district: "sanisidro",
        type: "comercial",
        status: "finalizado",
        lat: -12.0914,
        lng: -77.0507,
        x: -77.0507,
        y: -12.0914,
        description: "Edificio corporativo eco-amigable con certificación LEED Platinum. Cuenta con paneles solares, sistema de recolección de agua de lluvia y acabados sostenibles."
    },
    {
        id: 8,
        name: "Residencial El Faro",
        district: "miraflores",
        type: "residencial",
        status: "construccion",
        lat: -12.1131,
        lng: -77.0333,
        x: -77.0333,
        y: -12.1131,
        description: "Torre de 18 pisos con departamentos de 1, 2 y 3 dormitorios. Ubicado a 3 cuadras del Parque Kennedy y con excelente vista a la ciudad."
    },
    {
        id: 9,
        name: "Centro de Innovación Tecnológica",
        district: "sanisidro",
        type: "comercial",
        status: "planos",
        lat: -12.1033,
        lng: -77.0361,
        x: -77.0361,
        y: -12.1033,
        description: "Futuro hub tecnológico diseñado para albergar startups y empresas de tecnología. Incluirá laboratorios, espacios de prototipado y auditorios para eventos."
    },
    {
        id: 10,
        name: "Complejo Multifamiliar Los Pinos",
        district: "surco",
        type: "residencial",
        status: "finalizado",
        lat: -12.1261,
        lng: -76.9998,
        x: -76.9998,
        y: -12.1261,
        description: "Condominio familiar con 5 torres de 10 pisos, áreas verdes, piscina, gimnasio y zona de parrillas. Departamentos desde 75m² hasta 120m²."
    },
    {
        id: 11,
        name: "Teatro & Centro Cultural Barranco",
        district: "barranco",
        type: "comercial",
        status: "construccion",
        lat: -12.1367,
        lng: -77.0209,
        x: -77.0209,
        y: -12.1367,
        description: "Nuevo espacio cultural que incluirá un teatro para 400 personas, salas de exposición, y un centro de enseñanza artística. Estará ubicado en una casona restaurada."
    },
    {
        id: 12,
        name: "Residencial Parque Lince",
        district: "lince",
        type: "residencial",
        status: "finalizado",
        lat: -12.0878,
        lng: -77.0428,
        x: -77.0428,
        y: -12.0878,
        description: "Proyecto residencial de 12 pisos con departamentos de 1 y 2 dormitorios. Ideal para jóvenes profesionales y parejas. Incluye áreas comunes y gimnasio."
    },
    {
        id: 13,
        name: "Plaza Comercial Miraflores",
        district: "miraflores",
        type: "comercial",
        status: "planos",
        lat: -12.1176,
        lng: -77.0282,
        x: -77.0282,
        y: -12.1176,
        description: "Futuro complejo comercial que albergará tiendas exclusivas, restaurantes gourmet y un anfiteatro para eventos culturales al aire libre."
    },
    {
        id: 14,
        name: "Edificio Smart Living",
        district: "sanisidro",
        type: "mixto",
        status: "construccion",
        lat: -12.0989,
        lng: -77.0378,
        x: -77.0378,
        y: -12.0989,
        description: "Concepto innovador que integra viviendas inteligentes, oficinas y comercios en un solo edificio. Todos los espacios estarán equipados con tecnología domótica."
    },
    {
        id: 15,
        name: "Residencial Surco Gardens",
        district: "surco",
        type: "residencial",
        status: "finalizado",
        lat: -12.1342,
        lng: -76.9832,
        x: -76.9832,
        y: -12.1342,
        description: "Conjunto de casas tipo townhouse con jardines privados. El complejo cuenta con vigilancia, casa club y piscina para adultos y niños."
    },
    {
        id: 16,
        name: "Viña Barranco",
        district: "barranco",
        type: "residencial",
        status: "planos",
        lat: -12.1520,
        lng: -77.0280,
        x: -77.0280,
        y: -12.1520,
        description: "Exclusivo proyecto residencial inspirado en la arquitectura tradicional barranquina. Departamentos con terrazas y vista al mar en zona privilegiada."
    },
    {
        id: 17,
        name: "Edificio Corporativo El Central",
        district: "lince",
        type: "comercial",
        status: "planos",
        lat: -12.0930,
        lng: -77.0305,
        x: -77.0305,
        y: -12.0930,
        description: "Moderno edificio de oficinas con 15 pisos diseñado para empresas medianas y grandes. Ubicación estratégica con acceso a principales vías de la ciudad."
    },
    {
        id: 18,
        name: "Condominio Miraflores Sky",
        district: "miraflores",
        type: "residencial",
        status: "construccion",
        lat: -12.1084,
        lng: -77.0439,
        x: -77.0439,
        y: -12.1084,
        description: "Torre residencial de lujo con 25 pisos y vista panorámica al mar. Departamentos de 2 y 3 dormitorios con acabados de primera y amenities de lujo."
    },
    {
        id: 19,
        name: "Hotel & Centro de Convenciones Lima",
        district: "sanisidro",
        type: "mixto",
        status: "construccion",
        lat: -12.0883,
        lng: -77.0465,
        x: -77.0465,
        y: -12.0883,
        description: "Complejo que integrará un hotel 5 estrellas con 300 habitaciones y un centro de convenciones con capacidad para 2,000 personas."
    },
    {
        id: 20,
        name: "Residencial Los Jazmines",
        district: "surco",
        type: "residencial",
        status: "finalizado",
        lat: -12.1513,
        lng: -76.9974,
        x: -76.9974,
        y: -12.1513,
        description: "Condominio familiar con departamentos de 3 dormitorios, amplias áreas verdes, juegos para niños y zona de parrillas. Ubicado en zona tranquila y segura."
    }
];

// Exportar los datos de ejemplo
window.sampleProjects = sampleProjects; 