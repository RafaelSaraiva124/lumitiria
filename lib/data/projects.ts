export type Project = {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;
  summary: string;
  description: string[];
  specs: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    id: "moradia-vila-nova-de-famalicao",
    title: "Obra Carfil",
    category: "Caixilharia e Vidros",
    location: "Vila Nova de Famalicão",
    year: "2023",
    image: "/carfiljpg.jpg",
    summary:
      "Obra de caixilharia e vidro realizada para a Carfil, numa moradia de linhas contemporâneas.",
    description: [
      "Obra de caixilharia e vidro realizada para a Carfil, com vãos de grande dimensão pensados para maximizar a entrada de luz natural sem comprometer o desempenho térmico e acústico do edifício.",
      "Os perfis de alumínio com rutura térmica foram escolhidos pela durabilidade e baixa manutenção, com vidro duplo de controlo solar aplicado em todos os vãos.",
    ],
    specs: [
      { label: "Cliente", value: "Carfil" },
      { label: "Área de intervenção", value: "180 m²" },
      { label: "Material", value: "Alumínio com rutura térmica" },
    ],
  },
  {
    id: "credito-agricola-vila-nova-de-famalicao",
    title: "Crédito Agrícola",
    category: "Caixilharia e Fachadas",
    location: "Vila Nova de Famalicão",
    year: "2022",
    image: "/fachada.jpg",
    summary:
      "Caixilharia completa e fachada para uma agência do Crédito Agrícola em Vila Nova de Famalicão.",
    description: [
      "Conceção e instalação da caixilharia completa e da fachada em alumínio e vidro para uma agência do Crédito Agrícola, integrando os critérios de eficiência energética e imagem corporativa exigidos pelo cliente.",
    ],
    specs: [
      { label: "Tipologia", value: "Agência bancária" },
      { label: "Área de fachada", value: "1 200 m²" },
      { label: "Material", value: "Alumínio e vidro modular" },
    ],
  },
  {
    id: "showroom-comercial-braga",
    title: "Showroom Comercial",
    category: "Vidro",
    location: "Braga",
    year: "2023",
    image: "/vidros.jpg",
    summary: "Frentes de vidro estrutural para um showroom comercial em Braga.",
    description: [
      "Aplicação de vidro estrutural em fachada, criando uma frente de loja totalmente transparente que reforça a exposição do espaço comercial para a rua.",
      "Foi utilizado vidro laminado de segurança, garantindo proteção sem comprometer a transparência pretendida pelo cliente.",
    ],
    specs: [
      { label: "Tipologia", value: "Espaço comercial" },
      { label: "Área envidraçada", value: "90 m²" },
      { label: "Material", value: "Vidro laminado de segurança" },
    ],
  },
  {
    id: "escola-basica-ji-bairro",
    title: "Escola Básica / JI de Bairro",
    category: "Caixilharia e Estores",
    location: "Bairro, Vila Nova de Famalicão",
    year: "2021",
    image: "/estoures.jpg",
    summary:
      "Caixilharia e estores para a Escola Básica / Jardim de Infância de Bairro, em Vila Nova de Famalicão.",
    description: [
      "Substituição integral da caixilharia e instalação de estores exteriores na Escola Básica / Jardim de Infância de Bairro, combinando controlo de luz, privacidade e eficiência energética num edifício escolar.",
    ],
    specs: [
      { label: "Tipologia", value: "Escola Básica / Jardim de Infância" },
      { label: "Localização", value: "Bairro, Vila Nova de Famalicão" },
      { label: "Material", value: "Alumínio e estores exteriores" },
    ],
  },
];

export function getProjects() {
  return projects;
}

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}
